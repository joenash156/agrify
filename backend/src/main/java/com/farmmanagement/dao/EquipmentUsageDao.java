package com.farmmanagement.dao;

import java.util.UUID;

import com.farmmanagement.model.EquipmentUsage;
import java.util.List;
import java.util.Optional;

public interface EquipmentUsageDao {
    List<EquipmentUsage> findAll();
    Optional<EquipmentUsage> findById(UUID id);
    EquipmentUsage save(EquipmentUsage item);
    boolean update(UUID id, EquipmentUsage item);
    boolean delete(UUID id);
}
