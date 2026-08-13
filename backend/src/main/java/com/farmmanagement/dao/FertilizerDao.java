package com.farmmanagement.dao;

import java.util.UUID;

import com.farmmanagement.model.Fertilizer;
import java.util.List;
import java.util.Optional;

public interface FertilizerDao {
    List<Fertilizer> findAll();
    Optional<Fertilizer> findById(UUID id);
    Fertilizer save(Fertilizer item);
    boolean update(UUID id, Fertilizer item);
    boolean delete(UUID id);
}
