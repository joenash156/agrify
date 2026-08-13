package com.farmmanagement.dao;

import java.util.UUID;

import com.farmmanagement.model.InventoryTransaction;
import java.util.List;
import java.util.Optional;

public interface InventoryTransactionDao {
    List<InventoryTransaction> findAll();
    Optional<InventoryTransaction> findById(UUID id);
    InventoryTransaction save(InventoryTransaction item);
    boolean update(UUID id, InventoryTransaction item);
    boolean delete(UUID id);
}
