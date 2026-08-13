package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.InventoryDao;
import com.farmmanagement.model.Inventory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcInventoryDao implements InventoryDao {
    private final JdbcTemplate jdbcTemplate;

    public JdbcInventoryDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Inventory> findAll() {
        return jdbcTemplate.query("SELECT * FROM inventory", BeanPropertyRowMapper.newInstance(Inventory.class));
    }

    public Optional<Inventory> findById(UUID id) {
        List<Inventory> result = jdbcTemplate.query("SELECT * FROM inventory WHERE inventory_id = ?", BeanPropertyRowMapper.newInstance(Inventory.class), id);
        return result.stream().findFirst();
    }

    public Inventory save(Inventory item) {
        jdbcTemplate.update("INSERT INTO inventory (inventory_id, farm_id, item_name, quantity, unit_price) VALUES (?, ?, ?, ?, ?)", item.getInventoryId(), item.getFarmId(), item.getItemName(), item.getQuantity(), item.getUnitPrice());
        return item;
    }

    public boolean update(UUID id, Inventory item) {
        return jdbcTemplate.update("UPDATE inventory SET farm_id = ?, item_name = ?, quantity = ?, unit_price = ? WHERE inventory_id = ?", item.getFarmId(), item.getItemName(), item.getQuantity(), item.getUnitPrice(), id) > 0;
    }

    public boolean delete(UUID id) {
        return jdbcTemplate.update("DELETE FROM inventory WHERE inventory_id = ?", id) > 0;
    }
}
