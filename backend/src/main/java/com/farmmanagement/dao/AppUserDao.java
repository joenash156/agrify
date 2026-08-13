package com.farmmanagement.dao;

import java.util.UUID;

import com.farmmanagement.model.AppUser;
import java.util.List;
import java.util.Optional;

public interface AppUserDao {
    List<AppUser> findAll();
    Optional<AppUser> findById(UUID id);
    AppUser save(AppUser item);
    boolean update(UUID id, AppUser item);
    boolean delete(UUID id);
}
