package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.FarmDao;
import com.farmmanagement.model.Farm;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcFarmDao implements FarmDao {
    private final JdbcTemplate jdbcTemplate;

    public JdbcFarmDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Farm> findAll() {
        return jdbcTemplate.query("SELECT * FROM farm", BeanPropertyRowMapper.newInstance(Farm.class));
    }

    public Optional<Farm> findById(UUID id) {
        List<Farm> result = jdbcTemplate.query("SELECT * FROM farm WHERE farm_id = ?", BeanPropertyRowMapper.newInstance(Farm.class), id);
        return result.stream().findFirst();
    }

    public Farm save(Farm item) {
        jdbcTemplate.update("INSERT INTO farm (farm_id, farm_name, location, size, farm_status) VALUES (?, ?, ?, ?, ?)", item.getFarmId(), item.getFarmName(), item.getLocation(), item.getSize(), item.getFarmStatus());
        return item;
    }

    public boolean update(UUID id, Farm item) {
        return jdbcTemplate.update("UPDATE farm SET farm_name = ?, location = ?, size = ?, farm_status = ? WHERE farm_id = ?", item.getFarmName(), item.getLocation(), item.getSize(), item.getFarmStatus(), id) > 0;
    }

    public boolean delete(UUID id) {
        return jdbcTemplate.update("DELETE FROM farm WHERE farm_id = ?", id) > 0;
    }
}
