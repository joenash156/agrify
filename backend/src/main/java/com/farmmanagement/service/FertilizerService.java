package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.FertilizerDao;
import com.farmmanagement.dto.FertilizerDto;
import com.farmmanagement.model.Fertilizer;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FertilizerService {
    private final FertilizerDao dao;
    public FertilizerService(FertilizerDao dao) { this.dao = dao; }
    public List<Fertilizer> findAll() { return dao.findAll(); }
    public Fertilizer findById(UUID id) { return dao.findById(id).orElseThrow(() -> new RuntimeException("Fertilizer not found")); }
    public Fertilizer create(FertilizerDto dto) {
        Fertilizer item = new Fertilizer();
        item.setFertilizerId(java.util.UUID.randomUUID());
        item.setFertilizerName(dto.getFertilizerName());
        item.setFertilizerType(dto.getFertilizerType());
        item.setUnitPrice(dto.getUnitPrice());
        item.setQuantity(dto.getQuantity());
        return dao.save(item);
    }
    public Fertilizer update(UUID id, FertilizerDto dto) {
        Fertilizer item = new Fertilizer();
        item.setFertilizerId(id);
        item.setFertilizerName(dto.getFertilizerName());
        item.setFertilizerType(dto.getFertilizerType());
        item.setUnitPrice(dto.getUnitPrice());
        item.setQuantity(dto.getQuantity());
        if (!dao.update(id, item)) throw new RuntimeException("Fertilizer not found");
        return findById(id);
    }
    public void delete(UUID id) { if (!dao.delete(id)) throw new RuntimeException("Fertilizer not found"); }
}
