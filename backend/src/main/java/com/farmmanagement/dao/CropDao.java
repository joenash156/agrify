package com.farmmanagement.dao;

import java.util.UUID;

import com.farmmanagement.model.Crop;
import java.util.List;
import java.util.Optional;

public interface CropDao {
    List<Crop> findAll();
    Optional<Crop> findById(UUID id);
    Crop save(Crop item);
    boolean update(UUID id, Crop item);
    boolean delete(UUID id);
}
