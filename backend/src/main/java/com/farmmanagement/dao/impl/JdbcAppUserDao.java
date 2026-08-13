package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.AppUserDao;
import com.farmmanagement.model.AppUser;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcAppUserDao implements AppUserDao {
    private final JdbcTemplate jdbcTemplate;

    public JdbcAppUserDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<AppUser> findAll() {
        return jdbcTemplate.query("SELECT * FROM app_user", BeanPropertyRowMapper.newInstance(AppUser.class));
    }

    public Optional<AppUser> findById(UUID id) {
        List<AppUser> result = jdbcTemplate.query("SELECT * FROM app_user WHERE user_id = ?", BeanPropertyRowMapper.newInstance(AppUser.class), id);
        return result.stream().findFirst();
    }

    public AppUser save(AppUser item) {
        jdbcTemplate.update("INSERT INTO app_user (user_id, first_name, last_name, email, phone_number, other_phone_number) VALUES (?, ?, ?, ?, ?, ?)", item.getUserId(), item.getFirstName(), item.getLastName(), item.getEmail(), item.getPhoneNumber(), item.getOtherPhoneNumber());
        return item;
    }

    public boolean update(UUID id, AppUser item) {
        return jdbcTemplate.update("UPDATE app_user SET first_name = ?, last_name = ?, email = ?, phone_number = ?, other_phone_number = ? WHERE user_id = ?", item.getFirstName(), item.getLastName(), item.getEmail(), item.getPhoneNumber(), item.getOtherPhoneNumber(), id) > 0;
    }

    public boolean delete(UUID id) {
        return jdbcTemplate.update("DELETE FROM app_user WHERE user_id = ?", id) > 0;
    }
}
