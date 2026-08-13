package com.farmmanagement.dao;

import java.util.UUID;

import com.farmmanagement.model.Farm;
import java.util.List;
import java.util.Optional;

public interface FarmDao {
    List<Farm> findAll();
    Optional<Farm> findById(UUID id);
    Farm save(Farm item);
    boolean update(UUID id, Farm item);
    boolean delete(UUID id);
}
