package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.EquipmentMaintenanceDao;
import com.farmmanagement.model.EquipmentMaintenance;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcEquipmentMaintenanceDao implements EquipmentMaintenanceDao {
    private final JdbcTemplate jdbcTemplate;

    public JdbcEquipmentMaintenanceDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<EquipmentMaintenance> findAll() {
        return jdbcTemplate.query("SELECT * FROM equipment_maintenance", BeanPropertyRowMapper.newInstance(EquipmentMaintenance.class));
    }

    public Optional<EquipmentMaintenance> findById(UUID id) {
        List<EquipmentMaintenance> result = jdbcTemplate.query("SELECT * FROM equipment_maintenance WHERE maintenance_id = ?", BeanPropertyRowMapper.newInstance(EquipmentMaintenance.class), id);
        return result.stream().findFirst();
    }

    public EquipmentMaintenance save(EquipmentMaintenance item) {
        jdbcTemplate.update("INSERT INTO equipment_maintenance (maintenance_id, equipment_id, maintenance_date, maintenance_type, cost, description) VALUES (?, ?, ?, ?, ?, ?)", item.getMaintenanceId(), item.getEquipmentId(), item.getMaintenanceDate(), item.getMaintenanceType(), item.getCost(), item.getDescription());
        return item;
    }

    public boolean update(UUID id, EquipmentMaintenance item) {
        return jdbcTemplate.update("UPDATE equipment_maintenance SET equipment_id = ?, maintenance_date = ?, maintenance_type = ?, cost = ?, description = ? WHERE maintenance_id = ?", item.getEquipmentId(), item.getMaintenanceDate(), item.getMaintenanceType(), item.getCost(), item.getDescription(), id) > 0;
    }

    public boolean delete(UUID id) {
        return jdbcTemplate.update("DELETE FROM equipment_maintenance WHERE maintenance_id = ?", id) > 0;
    }
}
