package com.farmmanagement.security;

import java.util.UUID;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds one login per non-admin role, linked to seed app_user rows from
 * database/db/insert_data.sql, so every role in the frontend is actually
 * testable via a real login instead of just AdminInitializer's admin account.
 */
@Component
public class DemoAccountInitializer implements CommandLineRunner {
    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;

    public DemoAccountInitializer(JdbcTemplate jdbcTemplate, PasswordEncoder passwordEncoder) {
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seed("11000000-0000-0000-0000-000000000004", "farm.manager", "manager123", "FARM_MANAGER");
        seed("11000000-0000-0000-0000-000000000002", "sales.person", "sales123", "SALES_PERSON");
        seed("11000000-0000-0000-0000-000000000003", "field.worker", "worker123", "WORKER");
    }

    private void seed(String userId, String username, String rawPassword, String role) {
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM user_account WHERE username = ?", Integer.class, username);
        if (count != null && count == 0) {
            jdbcTemplate.update(
                    "INSERT INTO user_account (account_id, user_id, username, password_hash, account_status, role) VALUES (?,?,?,?,?,?)",
                    UUID.randomUUID(), UUID.fromString(userId), username, passwordEncoder.encode(rawPassword), "ACTIVE", role
            );
        }
    }
}
