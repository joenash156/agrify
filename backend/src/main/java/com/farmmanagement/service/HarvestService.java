package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.HarvestDao;
import com.farmmanagement.dto.HarvestDto;
import com.farmmanagement.model.Harvest;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HarvestService {
    private final HarvestDao dao;
    public HarvestService(HarvestDao dao) { this.dao = dao; }
    public List<Harvest> findAll() { return dao.findAll(); }
    public Harvest findById(UUID id) { return dao.findById(id).orElseThrow(() -> new RuntimeException("Harvest not found")); }
    public Harvest create(HarvestDto dto) {
        Harvest item = new Harvest();
        item.setHarvestId(UUID.randomUUID());
        item.setCropId(dto.getCropId());
        item.setHarvestDate(dto.getHarvestDate());
        item.setQuantity(dto.getQuantity());
        item.setUnit(dto.getUnit());
        item.setQualityGrade(dto.getQualityGrade());
        return dao.save(item);
    }
    public Harvest update(UUID id, HarvestDto dto) {
        Harvest item = new Harvest();
        item.setHarvestId(id);
        item.setCropId(dto.getCropId());
        item.setHarvestDate(dto.getHarvestDate());
        item.setQuantity(dto.getQuantity());
        item.setUnit(dto.getUnit());
        item.setQualityGrade(dto.getQualityGrade());
        if (!dao.update(id, item)) throw new RuntimeException("Harvest not found");
        return findById(id);
    }
    public void delete(UUID id) { if (!dao.delete(id)) throw new RuntimeException("Harvest not found"); }
}
