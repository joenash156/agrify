package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.EquipmentUsageDao;
import com.farmmanagement.model.EquipmentUsage;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcEquipmentUsageDao implements EquipmentUsageDao {
    private final JdbcTemplate jdbcTemplate;

    public JdbcEquipmentUsageDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<EquipmentUsage> findAll() {
        return jdbcTemplate.query("SELECT * FROM equipment_usage", BeanPropertyRowMapper.newInstance(EquipmentUsage.class));
    }

    public Optional<EquipmentUsage> findById(UUID id) {
        List<EquipmentUsage> result = jdbcTemplate.query("SELECT * FROM equipment_usage WHERE usage_id = ?", BeanPropertyRowMapper.newInstance(EquipmentUsage.class), id);
        return result.stream().findFirst();
    }

    public EquipmentUsage save(EquipmentUsage item) {
        jdbcTemplate.update("INSERT INTO equipment_usage (usage_id, equipment_id, employment_id, usage_date, hours_used) VALUES (?, ?, ?, ?, ?)", item.getUsageId(), item.getEquipmentId(), item.getEmploymentId(), item.getUsageDate(), item.getHoursUsed());
        return item;
    }

    public boolean update(UUID id, EquipmentUsage item) {
        return jdbcTemplate.update("UPDATE equipment_usage SET equipment_id = ?, employment_id = ?, usage_date = ?, hours_used = ? WHERE usage_id = ?", item.getEquipmentId(), item.getEmploymentId(), item.getUsageDate(), item.getHoursUsed(), id) > 0;
    }

    public boolean delete(UUID id) {
        return jdbcTemplate.update("DELETE FROM equipment_usage WHERE usage_id = ?", id) > 0;
    }
}
