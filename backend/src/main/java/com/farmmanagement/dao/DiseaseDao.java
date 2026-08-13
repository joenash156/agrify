package com.farmmanagement.dao;

import java.util.UUID;

import com.farmmanagement.model.Disease;
import java.util.List;
import java.util.Optional;

public interface DiseaseDao {
    List<Disease> findAll();
    Optional<Disease> findById(UUID id);
    Disease save(Disease item);
    boolean update(UUID id, Disease item);
    boolean delete(UUID id);
}
