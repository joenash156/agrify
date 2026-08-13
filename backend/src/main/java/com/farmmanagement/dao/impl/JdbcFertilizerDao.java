package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.FertilizerDao;
import com.farmmanagement.model.Fertilizer;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcFertilizerDao implements FertilizerDao {
    private final JdbcTemplate jdbcTemplate;

    public JdbcFertilizerDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Fertilizer> findAll() {
        return jdbcTemplate.query("SELECT * FROM fertilizer", BeanPropertyRowMapper.newInstance(Fertilizer.class));
    }

    public Optional<Fertilizer> findById(UUID id) {
        List<Fertilizer> result = jdbcTemplate.query("SELECT * FROM fertilizer WHERE fertilizer_id = ?", BeanPropertyRowMapper.newInstance(Fertilizer.class), id);
        return result.stream().findFirst();
    }

    public Fertilizer save(Fertilizer item) {
        jdbcTemplate.update("INSERT INTO fertilizer (fertilizer_id, fertilizer_name, fertilizer_type, unit_price, quantity) VALUES (?, ?, ?, ?, ?)", item.getFertilizerId(), item.getFertilizerName(), item.getFertilizerType(), item.getUnitPrice(), item.getQuantity());
        return item;
    }

    public boolean update(UUID id, Fertilizer item) {
        return jdbcTemplate.update("UPDATE fertilizer SET fertilizer_name = ?, fertilizer_type = ?, unit_price = ?, quantity = ? WHERE fertilizer_id = ?", item.getFertilizerName(), item.getFertilizerType(), item.getUnitPrice(), item.getQuantity(), id) > 0;
    }

    public boolean delete(UUID id) {
        return jdbcTemplate.update("DELETE FROM fertilizer WHERE fertilizer_id = ?", id) > 0;
    }
}
