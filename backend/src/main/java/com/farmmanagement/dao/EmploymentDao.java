package com.farmmanagement.dao;

import java.util.UUID;

import com.farmmanagement.model.Employment;
import java.util.List;
import java.util.Optional;

public interface EmploymentDao {
    List<Employment> findAll();
    Optional<Employment> findById(UUID id);
    Employment save(Employment item);
    boolean update(UUID id, Employment item);
    boolean delete(UUID id);
}
