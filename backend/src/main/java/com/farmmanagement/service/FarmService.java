package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.FarmDao;
import com.farmmanagement.dto.FarmDto;
import com.farmmanagement.model.Farm;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FarmService {
    private final FarmDao dao;
    public FarmService(FarmDao dao) { this.dao = dao; }
    public List<Farm> findAll() { return dao.findAll(); }
    public Farm findById(UUID id) { return dao.findById(id).orElseThrow(() -> new RuntimeException("Farm not found")); }
    public Farm create(FarmDto dto) {
        Farm item = new Farm();
        item.setFarmId(java.util.UUID.randomUUID());
        item.setFarmName(dto.getFarmName());
        item.setLocation(dto.getLocation());
        item.setSize(dto.getSize());
        item.setFarmStatus(dto.getFarmStatus());
        return dao.save(item);
    }
    public Farm update(UUID id, FarmDto dto) {
        Farm item = new Farm();
        item.setFarmId(id);
        item.setFarmName(dto.getFarmName());
        item.setLocation(dto.getLocation());
        item.setSize(dto.getSize());
        item.setFarmStatus(dto.getFarmStatus());
        if (!dao.update(id, item)) throw new RuntimeException("Farm not found");
        return findById(id);
    }
    public void delete(UUID id) { if (!dao.delete(id)) throw new RuntimeException("Farm not found"); }
}
