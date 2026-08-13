package com.farmmanagement.dao;

import java.util.UUID;

import com.farmmanagement.model.Inventory;
import java.util.List;
import java.util.Optional;

public interface InventoryDao {
    List<Inventory> findAll();
    Optional<Inventory> findById(UUID id);
    Inventory save(Inventory item);
    boolean update(UUID id, Inventory item);
    boolean delete(UUID id);
}
