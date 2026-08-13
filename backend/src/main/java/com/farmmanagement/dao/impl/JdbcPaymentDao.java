package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.PaymentDao;
import com.farmmanagement.model.Payment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcPaymentDao implements PaymentDao {
    private final JdbcTemplate jdbcTemplate;

    public JdbcPaymentDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Payment> findAll() {
        return jdbcTemplate.query("SELECT * FROM payment", BeanPropertyRowMapper.newInstance(Payment.class));
    }

    public Optional<Payment> findById(UUID id) {
        List<Payment> result = jdbcTemplate.query("SELECT * FROM payment WHERE payment_id = ?", BeanPropertyRowMapper.newInstance(Payment.class), id);
        return result.stream().findFirst();
    }

    public Payment save(Payment item) {
        jdbcTemplate.update("INSERT INTO payment (payment_id, sale_id, amount, payment_method, payment_status) VALUES (?, ?, ?, ?, ?)", item.getPaymentId(), item.getSaleId(), item.getAmount(), item.getPaymentMethod(), item.getPaymentStatus());
        return item;
    }

    public boolean update(UUID id, Payment item) {
        return jdbcTemplate.update("UPDATE payment SET sale_id = ?, amount = ?, payment_method = ?, payment_status = ? WHERE payment_id = ?", item.getSaleId(), item.getAmount(), item.getPaymentMethod(), item.getPaymentStatus(), id) > 0;
    }

    public boolean delete(UUID id) {
        return jdbcTemplate.update("DELETE FROM payment WHERE payment_id = ?", id) > 0;
    }
}
