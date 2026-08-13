package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.EquipmentDao;
import com.farmmanagement.model.Equipment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcEquipmentDao implements EquipmentDao {
    private final JdbcTemplate jdbcTemplate;

    public JdbcEquipmentDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Equipment> findAll() {
        return jdbcTemplate.query("SELECT * FROM equipment", BeanPropertyRowMapper.newInstance(Equipment.class));
    }

    public Optional<Equipment> findById(UUID id) {
        List<Equipment> result = jdbcTemplate.query("SELECT * FROM equipment WHERE equipment_id = ?", BeanPropertyRowMapper.newInstance(Equipment.class), id);
        return result.stream().findFirst();
    }

    public Equipment save(Equipment item) {
        jdbcTemplate.update("INSERT INTO equipment (equipment_id, farm_id, equipment_name, equipment_type, purchase_date, purchase_cost, equipment_status) VALUES (?, ?, ?, ?, ?, ?, ?)", item.getEquipmentId(), item.getFarmId(), item.getEquipmentName(), item.getEquipmentType(), item.getPurchaseDate(), item.getPurchaseCost(), item.getEquipmentStatus());
        return item;
    }

    public boolean update(UUID id, Equipment item) {
        return jdbcTemplate.update("UPDATE equipment SET farm_id = ?, equipment_name = ?, equipment_type = ?, purchase_date = ?, purchase_cost = ?, equipment_status = ? WHERE equipment_id = ?", item.getFarmId(), item.getEquipmentName(), item.getEquipmentType(), item.getPurchaseDate(), item.getPurchaseCost(), item.getEquipmentStatus(), id) > 0;
    }

    public boolean delete(UUID id) {
        return jdbcTemplate.update("DELETE FROM equipment WHERE equipment_id = ?", id) > 0;
    }
}
