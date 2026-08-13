package com.farmmanagement.dao;

import java.util.UUID;

import com.farmmanagement.model.UserAccount;
import java.util.List;
import java.util.Optional;

public interface UserAccountDao {
    Optional<UserAccount> findByUsername(String username);
    Optional<UserAccount> findById(UUID id);
    List<UserAccount> findAll();
    void create(UserAccount account);
    void updateStatusAndRole(UUID id, String status, String role);
    void delete(UUID id);
}
