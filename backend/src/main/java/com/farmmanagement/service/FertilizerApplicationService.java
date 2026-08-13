package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.FertilizerApplicationDao;
import com.farmmanagement.dto.FertilizerApplicationDto;
import com.farmmanagement.model.FertilizerApplication;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FertilizerApplicationService {
    private final FertilizerApplicationDao dao;
    public FertilizerApplicationService(FertilizerApplicationDao dao) { this.dao = dao; }
    public List<FertilizerApplication> findAll() { return dao.findAll(); }
    public FertilizerApplication findById(UUID id) { return dao.findById(id).orElseThrow(() -> new RuntimeException("FertilizerApplication not found")); }
    public FertilizerApplication create(FertilizerApplicationDto dto) {
        FertilizerApplication item = new FertilizerApplication();
        item.setApplicationId(java.util.UUID.randomUUID());
        item.setCropId(dto.getCropId());
        item.setEmploymentId(dto.getEmploymentId());
        item.setFertilizerId(dto.getFertilizerId());
        item.setApplicationDate(dto.getApplicationDate());
        item.setQuantity(dto.getQuantity());
        item.setNotes(dto.getNotes());
        return dao.save(item);
    }
    public FertilizerApplication update(UUID id, FertilizerApplicationDto dto) {
        FertilizerApplication item = new FertilizerApplication();
        item.setApplicationId(id);
        item.setCropId(dto.getCropId());
        item.setEmploymentId(dto.getEmploymentId());
        item.setFertilizerId(dto.getFertilizerId());
        item.setApplicationDate(dto.getApplicationDate());
        item.setQuantity(dto.getQuantity());
        item.setNotes(dto.getNotes());
        if (!dao.update(id, item)) throw new RuntimeException("FertilizerApplication not found");
        return findById(id);
    }
    public void delete(UUID id) { if (!dao.delete(id)) throw new RuntimeException("FertilizerApplication not found"); }
}
