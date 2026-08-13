package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.CropDao;
import com.farmmanagement.dto.CropDto;
import com.farmmanagement.model.Crop;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CropService {
    private final CropDao dao;
    public CropService(CropDao dao) { this.dao = dao; }
    public List<Crop> findAll() { return dao.findAll(); }
    public Crop findById(UUID id) { return dao.findById(id).orElseThrow(() -> new RuntimeException("Crop not found")); }
    public Crop create(CropDto dto) {
        Crop item = new Crop();
        item.setCropId(java.util.UUID.randomUUID());
        item.setFarmId(dto.getFarmId());
        item.setCropName(dto.getCropName());
        item.setCropVariety(dto.getCropVariety());
        item.setPlantingDate(dto.getPlantingDate());
        item.setExpectedHarvestDate(dto.getExpectedHarvestDate());
        item.setCropStatus(dto.getCropStatus());
        return dao.save(item);
    }
    public Crop update(UUID id, CropDto dto) {
        Crop item = new Crop();
        item.setCropId(id);
        item.setFarmId(dto.getFarmId());
        item.setCropName(dto.getCropName());
        item.setCropVariety(dto.getCropVariety());
        item.setPlantingDate(dto.getPlantingDate());
        item.setExpectedHarvestDate(dto.getExpectedHarvestDate());
        item.setCropStatus(dto.getCropStatus());
        if (!dao.update(id, item)) throw new RuntimeException("Crop not found");
        return findById(id);
    }
    public void delete(UUID id) { if (!dao.delete(id)) throw new RuntimeException("Crop not found"); }
}
