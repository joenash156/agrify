package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.HarvestDao;
import com.farmmanagement.model.Harvest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcHarvestDao implements HarvestDao {
    private final JdbcTemplate jdbcTemplate;

    public JdbcHarvestDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Harvest> findAll() {
        return jdbcTemplate.query("SELECT * FROM harvest", BeanPropertyRowMapper.newInstance(Harvest.class));
    }

    public Optional<Harvest> findById(UUID id) {
        List<Harvest> result = jdbcTemplate.query("SELECT * FROM harvest WHERE harvest_id = ?", BeanPropertyRowMapper.newInstance(Harvest.class), id);
        return result.stream().findFirst();
    }

    public Harvest save(Harvest item) {
        jdbcTemplate.update("INSERT INTO harvest (harvest_id, crop_id, harvest_date, quantity, unit, quality_grade) VALUES (?, ?, ?, ?, ?, ?)",
                item.getHarvestId(), item.getCropId(), item.getHarvestDate(), item.getQuantity(), item.getUnit(), item.getQualityGrade());
        return item;
    }

    public boolean update(UUID id, Harvest item) {
        return jdbcTemplate.update("UPDATE harvest SET crop_id = ?, harvest_date = ?, quantity = ?, unit = ?, quality_grade = ? WHERE harvest_id = ?",
                item.getCropId(), item.getHarvestDate(), item.getQuantity(), item.getUnit(), item.getQualityGrade(), id) > 0;
    }

    public boolean delete(UUID id) {
        return jdbcTemplate.update("DELETE FROM harvest WHERE harvest_id = ?", id) > 0;
    }
}
