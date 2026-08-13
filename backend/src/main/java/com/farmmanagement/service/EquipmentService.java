package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.EquipmentDao;
import com.farmmanagement.dto.EquipmentDto;
import com.farmmanagement.model.Equipment;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EquipmentService {
    private final EquipmentDao dao;
    public EquipmentService(EquipmentDao dao) { this.dao = dao; }
    public List<Equipment> findAll() { return dao.findAll(); }
    public Equipment findById(UUID id) { return dao.findById(id).orElseThrow(() -> new RuntimeException("Equipment not found")); }
    public Equipment create(EquipmentDto dto) {
        Equipment item = new Equipment();
        item.setEquipmentId(java.util.UUID.randomUUID());
        item.setFarmId(dto.getFarmId());
        item.setEquipmentName(dto.getEquipmentName());
        item.setEquipmentType(dto.getEquipmentType());
        item.setPurchaseDate(dto.getPurchaseDate());
        item.setPurchaseCost(dto.getPurchaseCost());
        item.setEquipmentStatus(dto.getEquipmentStatus());
        return dao.save(item);
    }
    public Equipment update(UUID id, EquipmentDto dto) {
        Equipment item = new Equipment();
        item.setEquipmentId(id);
        item.setFarmId(dto.getFarmId());
        item.setEquipmentName(dto.getEquipmentName());
        item.setEquipmentType(dto.getEquipmentType());
        item.setPurchaseDate(dto.getPurchaseDate());
        item.setPurchaseCost(dto.getPurchaseCost());
        item.setEquipmentStatus(dto.getEquipmentStatus());
        if (!dao.update(id, item)) throw new RuntimeException("Equipment not found");
        return findById(id);
    }
    public void delete(UUID id) { if (!dao.delete(id)) throw new RuntimeException("Equipment not found"); }
}
