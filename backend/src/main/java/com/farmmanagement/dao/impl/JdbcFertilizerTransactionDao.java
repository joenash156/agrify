package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.FertilizerTransactionDao;
import com.farmmanagement.model.FertilizerTransaction;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcFertilizerTransactionDao implements FertilizerTransactionDao {
    private final JdbcTemplate jdbcTemplate;

    public JdbcFertilizerTransactionDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<FertilizerTransaction> findAll() {
        return jdbcTemplate.query("SELECT * FROM fertilizer_transaction", BeanPropertyRowMapper.newInstance(FertilizerTransaction.class));
    }

    public Optional<FertilizerTransaction> findById(UUID id) {
        List<FertilizerTransaction> result = jdbcTemplate.query("SELECT * FROM fertilizer_transaction WHERE transaction_id = ?", BeanPropertyRowMapper.newInstance(FertilizerTransaction.class), id);
        return result.stream().findFirst();
    }

    public FertilizerTransaction save(FertilizerTransaction item) {
        jdbcTemplate.update("INSERT INTO fertilizer_transaction (transaction_id, fertilizer_id, transaction_type, quantity, unit_price) VALUES (?, ?, ?, ?, ?)", item.getTransactionId(), item.getFertilizerId(), item.getTransactionType(), item.getQuantity(), item.getUnitPrice());
        return item;
    }

    public boolean update(UUID id, FertilizerTransaction item) {
        return jdbcTemplate.update("UPDATE fertilizer_transaction SET fertilizer_id = ?, transaction_type = ?, quantity = ?, unit_price = ? WHERE transaction_id = ?", item.getFertilizerId(), item.getTransactionType(), item.getQuantity(), item.getUnitPrice(), id) > 0;
    }

    public boolean delete(UUID id) {
        return jdbcTemplate.update("DELETE FROM fertilizer_transaction WHERE transaction_id = ?", id) > 0;
    }
}
