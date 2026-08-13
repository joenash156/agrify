package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.InventoryTransactionDao;
import com.farmmanagement.model.InventoryTransaction;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcInventoryTransactionDao implements InventoryTransactionDao {
    private final JdbcTemplate jdbcTemplate;

    public JdbcInventoryTransactionDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<InventoryTransaction> findAll() {
        return jdbcTemplate.query("SELECT * FROM inventory_transaction", BeanPropertyRowMapper.newInstance(InventoryTransaction.class));
    }

    public Optional<InventoryTransaction> findById(UUID id) {
        List<InventoryTransaction> result = jdbcTemplate.query("SELECT * FROM inventory_transaction WHERE transaction_id = ?", BeanPropertyRowMapper.newInstance(InventoryTransaction.class), id);
        return result.stream().findFirst();
    }

    public InventoryTransaction save(InventoryTransaction item) {
        jdbcTemplate.update("INSERT INTO inventory_transaction (transaction_id, inventory_id, transaction_type, quantity) VALUES (?, ?, ?, ?)", item.getTransactionId(), item.getInventoryId(), item.getTransactionType(), item.getQuantity());
        return item;
    }

    public boolean update(UUID id, InventoryTransaction item) {
        return jdbcTemplate.update("UPDATE inventory_transaction SET inventory_id = ?, transaction_type = ?, quantity = ? WHERE transaction_id = ?", item.getInventoryId(), item.getTransactionType(), item.getQuantity(), id) > 0;
    }

    public boolean delete(UUID id) {
        return jdbcTemplate.update("DELETE FROM inventory_transaction WHERE transaction_id = ?", id) > 0;
    }
}
