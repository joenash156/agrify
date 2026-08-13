package com.farmmanagement.dao;

import java.util.UUID;

import com.farmmanagement.model.FertilizerTransaction;
import java.util.List;
import java.util.Optional;

public interface FertilizerTransactionDao {
    List<FertilizerTransaction> findAll();
    Optional<FertilizerTransaction> findById(UUID id);
    FertilizerTransaction save(FertilizerTransaction item);
    boolean update(UUID id, FertilizerTransaction item);
    boolean delete(UUID id);
}
