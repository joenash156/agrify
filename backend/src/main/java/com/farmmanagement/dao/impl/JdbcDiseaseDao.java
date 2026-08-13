package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.DiseaseDao;
import com.farmmanagement.model.Disease;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcDiseaseDao implements DiseaseDao {
    private final JdbcTemplate jdbcTemplate;

    public JdbcDiseaseDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Disease> findAll() {
        return jdbcTemplate.query("SELECT * FROM disease", BeanPropertyRowMapper.newInstance(Disease.class));
    }

    public Optional<Disease> findById(UUID id) {
        List<Disease> result = jdbcTemplate.query("SELECT * FROM disease WHERE disease_id = ?", BeanPropertyRowMapper.newInstance(Disease.class), id);
        return result.stream().findFirst();
    }

    public Disease save(Disease item) {
        jdbcTemplate.update("INSERT INTO disease (disease_id, disease_name, description) VALUES (?, ?, ?)", item.getDiseaseId(), item.getDiseaseName(), item.getDescription());
        return item;
    }

    public boolean update(UUID id, Disease item) {
        return jdbcTemplate.update("UPDATE disease SET disease_name = ?, description = ? WHERE disease_id = ?", item.getDiseaseName(), item.getDescription(), id) > 0;
    }

    public boolean delete(UUID id) {
        return jdbcTemplate.update("DELETE FROM disease WHERE disease_id = ?", id) > 0;
    }
}
