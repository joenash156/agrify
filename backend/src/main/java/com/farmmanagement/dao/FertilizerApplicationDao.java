package com.farmmanagement.dao;

import java.util.UUID;

import com.farmmanagement.model.FertilizerApplication;
import java.util.List;
import java.util.Optional;

public interface FertilizerApplicationDao {
    List<FertilizerApplication> findAll();
    Optional<FertilizerApplication> findById(UUID id);
    FertilizerApplication save(FertilizerApplication item);
    boolean update(UUID id, FertilizerApplication item);
    boolean delete(UUID id);
}
