package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.EquipmentUsageDao;
import com.farmmanagement.dto.EquipmentUsageDto;
import com.farmmanagement.model.EquipmentUsage;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EquipmentUsageService {
    private final EquipmentUsageDao dao;
    public EquipmentUsageService(EquipmentUsageDao dao) { this.dao = dao; }
    public List<EquipmentUsage> findAll() { return dao.findAll(); }
    public EquipmentUsage findById(UUID id) { return dao.findById(id).orElseThrow(() -> new RuntimeException("EquipmentUsage not found")); }
    public EquipmentUsage create(EquipmentUsageDto dto) {
        EquipmentUsage item = new EquipmentUsage();
        item.setUsageId(java.util.UUID.randomUUID());
        item.setEquipmentId(dto.getEquipmentId());
        item.setEmploymentId(dto.getEmploymentId());
        item.setUsageDate(dto.getUsageDate());
        item.setHoursUsed(dto.getHoursUsed());
        return dao.save(item);
    }
    public EquipmentUsage update(UUID id, EquipmentUsageDto dto) {
        EquipmentUsage item = new EquipmentUsage();
        item.setUsageId(id);
        item.setEquipmentId(dto.getEquipmentId());
        item.setEmploymentId(dto.getEmploymentId());
        item.setUsageDate(dto.getUsageDate());
        item.setHoursUsed(dto.getHoursUsed());
        if (!dao.update(id, item)) throw new RuntimeException("EquipmentUsage not found");
        return findById(id);
    }
    public void delete(UUID id) { if (!dao.delete(id)) throw new RuntimeException("EquipmentUsage not found"); }
}
