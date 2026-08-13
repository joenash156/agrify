package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.EquipmentMaintenanceDao;
import com.farmmanagement.dto.EquipmentMaintenanceDto;
import com.farmmanagement.model.EquipmentMaintenance;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EquipmentMaintenanceService {
    private final EquipmentMaintenanceDao dao;
    public EquipmentMaintenanceService(EquipmentMaintenanceDao dao) { this.dao = dao; }
    public List<EquipmentMaintenance> findAll() { return dao.findAll(); }
    public EquipmentMaintenance findById(UUID id) { return dao.findById(id).orElseThrow(() -> new RuntimeException("EquipmentMaintenance not found")); }
    public EquipmentMaintenance create(EquipmentMaintenanceDto dto) {
        EquipmentMaintenance item = new EquipmentMaintenance();
        item.setMaintenanceId(java.util.UUID.randomUUID());
        item.setEquipmentId(dto.getEquipmentId());
        item.setMaintenanceDate(dto.getMaintenanceDate());
        item.setMaintenanceType(dto.getMaintenanceType());
        item.setCost(dto.getCost());
        item.setDescription(dto.getDescription());
        return dao.save(item);
    }
    public EquipmentMaintenance update(UUID id, EquipmentMaintenanceDto dto) {
        EquipmentMaintenance item = new EquipmentMaintenance();
        item.setMaintenanceId(id);
        item.setEquipmentId(dto.getEquipmentId());
        item.setMaintenanceDate(dto.getMaintenanceDate());
        item.setMaintenanceType(dto.getMaintenanceType());
        item.setCost(dto.getCost());
        item.setDescription(dto.getDescription());
        if (!dao.update(id, item)) throw new RuntimeException("EquipmentMaintenance not found");
        return findById(id);
    }
    public void delete(UUID id) { if (!dao.delete(id)) throw new RuntimeException("EquipmentMaintenance not found"); }
}
