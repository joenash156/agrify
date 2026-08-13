package com.farmmanagement.dao;

import java.util.UUID;

import com.farmmanagement.model.Harvest;
import java.util.List;
import java.util.Optional;

public interface HarvestDao {
    List<Harvest> findAll();
    Optional<Harvest> findById(UUID id);
    Harvest save(Harvest item);
    boolean update(UUID id, Harvest item);
    boolean delete(UUID id);
}
