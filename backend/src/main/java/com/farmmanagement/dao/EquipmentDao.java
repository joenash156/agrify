package com.farmmanagement.dao;

import java.util.UUID;

import com.farmmanagement.model.Equipment;
import java.util.List;
import java.util.Optional;

public interface EquipmentDao {
    List<Equipment> findAll();
    Optional<Equipment> findById(UUID id);
    Equipment save(Equipment item);
    boolean update(UUID id, Equipment item);
    boolean delete(UUID id);
}
