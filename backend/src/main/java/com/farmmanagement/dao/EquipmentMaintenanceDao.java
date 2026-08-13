package com.farmmanagement.dao;

import java.util.UUID;

import com.farmmanagement.model.EquipmentMaintenance;
import java.util.List;
import java.util.Optional;

public interface EquipmentMaintenanceDao {
    List<EquipmentMaintenance> findAll();
    Optional<EquipmentMaintenance> findById(UUID id);
    EquipmentMaintenance save(EquipmentMaintenance item);
    boolean update(UUID id, EquipmentMaintenance item);
    boolean delete(UUID id);
}
