package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.CropDao;
import com.farmmanagement.model.Crop;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcCropDao implements CropDao {
    private final JdbcTemplate jdbcTemplate;

    public JdbcCropDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Crop> findAll() {
        return jdbcTemplate.query("SELECT * FROM crop", BeanPropertyRowMapper.newInstance(Crop.class));
    }

    public Optional<Crop> findById(UUID id) {
        List<Crop> result = jdbcTemplate.query("SELECT * FROM crop WHERE crop_id = ?", BeanPropertyRowMapper.newInstance(Crop.class), id);
        return result.stream().findFirst();
    }

    public Crop save(Crop item) {
        jdbcTemplate.update("INSERT INTO crop (crop_id, farm_id, crop_name, crop_variety, planting_date, expected_harvest_date, crop_status) VALUES (?, ?, ?, ?, ?, ?, ?)", item.getCropId(), item.getFarmId(), item.getCropName(), item.getCropVariety(), item.getPlantingDate(), item.getExpectedHarvestDate(), item.getCropStatus());
        return item;
    }

    public boolean update(UUID id, Crop item) {
        return jdbcTemplate.update("UPDATE crop SET farm_id = ?, crop_name = ?, crop_variety = ?, planting_date = ?, expected_harvest_date = ?, crop_status = ? WHERE crop_id = ?", item.getFarmId(), item.getCropName(), item.getCropVariety(), item.getPlantingDate(), item.getExpectedHarvestDate(), item.getCropStatus(), id) > 0;
    }

    public boolean delete(UUID id) {
        return jdbcTemplate.update("DELETE FROM crop WHERE crop_id = ?", id) > 0;
    }
}
