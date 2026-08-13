package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.CropDiseaseDao;
import com.farmmanagement.model.CropDisease;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class JdbcCropDiseaseDao implements CropDiseaseDao {
    private final JdbcTemplate jdbcTemplate;
    public JdbcCropDiseaseDao(JdbcTemplate jdbcTemplate){this.jdbcTemplate=jdbcTemplate;}
    public List<CropDisease> findAll(){return jdbcTemplate.query("SELECT * FROM crop_disease",BeanPropertyRowMapper.newInstance(CropDisease.class));}
    public List<CropDisease> findByCrop(UUID cropId){return jdbcTemplate.query("SELECT * FROM crop_disease WHERE crop_id=?",BeanPropertyRowMapper.newInstance(CropDisease.class),cropId);}
    public void save(CropDisease item){
        jdbcTemplate.update("INSERT INTO crop_disease(crop_disease_id,crop_id,disease_id,detected_date,severity,treatment) VALUES(?,?,?,?,?,?)",
                item.getCropDiseaseId(),item.getCropId(),item.getDiseaseId(),item.getDetectedDate(),item.getSeverity(),item.getTreatment());
    }
    public boolean delete(UUID cropDiseaseId){return jdbcTemplate.update("DELETE FROM crop_disease WHERE crop_disease_id=?",cropDiseaseId) > 0;}
}
