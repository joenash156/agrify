package com.farmmanagement.dao;

import java.util.UUID;

import com.farmmanagement.model.UserAccount;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserAccountDao {
    Optional<UserAccount> findByUsername(String username);
    Optional<UserAccount> findById(UUID id);
    Optional<UserAccount> findByUserId(UUID userId);
    Optional<UserAccount> findByRefreshTokenHash(String refreshTokenHash);
    List<UserAccount> findAll();
    void create(UserAccount account);
    void updateStatusAndRole(UUID id, String status, String role);
    void updatePasswordHash(UUID id, String passwordHash);
    void updateRefreshToken(UUID id, String refreshTokenHash, LocalDateTime expiresAt);
    void clearRefreshToken(UUID id);
    void delete(UUID id);
}
