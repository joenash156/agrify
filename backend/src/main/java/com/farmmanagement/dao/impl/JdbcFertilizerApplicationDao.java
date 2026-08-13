package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.FertilizerApplicationDao;
import com.farmmanagement.model.FertilizerApplication;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcFertilizerApplicationDao implements FertilizerApplicationDao {
    private final JdbcTemplate jdbcTemplate;

    public JdbcFertilizerApplicationDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<FertilizerApplication> findAll() {
        return jdbcTemplate.query("SELECT * FROM fertilizer_application", BeanPropertyRowMapper.newInstance(FertilizerApplication.class));
    }

    public Optional<FertilizerApplication> findById(UUID id) {
        List<FertilizerApplication> result = jdbcTemplate.query("SELECT * FROM fertilizer_application WHERE application_id = ?", BeanPropertyRowMapper.newInstance(FertilizerApplication.class), id);
        return result.stream().findFirst();
    }

    public FertilizerApplication save(FertilizerApplication item) {
        jdbcTemplate.update("INSERT INTO fertilizer_application (application_id, crop_id, employment_id, fertilizer_id, application_date, quantity, notes) VALUES (?, ?, ?, ?, ?, ?, ?)", item.getApplicationId(), item.getCropId(), item.getEmploymentId(), item.getFertilizerId(), item.getApplicationDate(), item.getQuantity(), item.getNotes());
        return item;
    }

    public boolean update(UUID id, FertilizerApplication item) {
        return jdbcTemplate.update("UPDATE fertilizer_application SET crop_id = ?, employment_id = ?, fertilizer_id = ?, application_date = ?, quantity = ?, notes = ? WHERE application_id = ?", item.getCropId(), item.getEmploymentId(), item.getFertilizerId(), item.getApplicationDate(), item.getQuantity(), item.getNotes(), id) > 0;
    }

    public boolean delete(UUID id) {
        return jdbcTemplate.update("DELETE FROM fertilizer_application WHERE application_id = ?", id) > 0;
    }
}
