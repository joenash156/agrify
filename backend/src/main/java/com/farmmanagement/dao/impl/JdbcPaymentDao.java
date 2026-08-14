package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.PaymentDao;
import com.farmmanagement.model.Payment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class JdbcPaymentDao implements PaymentDao {
    private final JdbcTemplate jdbcTemplate;
    private final SimpleJdbcInsert insert;

    public JdbcPaymentDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        // usingColumns pins the insert to exactly these columns — without it, SimpleJdbcInsert
        // writes every table column explicitly (NULL for anything not in the params map), which
        // stomps on payment_date's DEFAULT instead of leaving it to the database.
        this.insert = new SimpleJdbcInsert(jdbcTemplate).withTableName("payment").usingGeneratedKeyColumns("payment_seq")
                .usingColumns("payment_id", "sale_id", "amount", "payment_method", "payment_status", "payment_date", "public_id");
    }

    public List<Payment> findAll() {
        return jdbcTemplate.query("SELECT * FROM payment", BeanPropertyRowMapper.newInstance(Payment.class));
    }

    public Optional<Payment> findById(UUID id) {
        List<Payment> result = jdbcTemplate.query("SELECT * FROM payment WHERE payment_id = ?", BeanPropertyRowMapper.newInstance(Payment.class), id);
        return result.stream().findFirst();
    }

    public Payment save(Payment item) {
        // SimpleJdbcInsert only writes columns present in this map — unlike a plain INSERT that
        // omits a column entirely, it doesn't fall back to the column's DEFAULT CURRENT_TIMESTAMP,
        // so payment_date has to be set explicitly here or it lands as NULL and violates NOT NULL.
        LocalDateTime now = LocalDateTime.now();
        Map<String, Object> params = new HashMap<>();
        params.put("payment_id", item.getPaymentId());
        params.put("sale_id", item.getSaleId());
        params.put("amount", item.getAmount());
        params.put("payment_method", item.getPaymentMethod());
        params.put("payment_status", item.getPaymentStatus());
        params.put("payment_date", now);
        params.put("public_id", "");
        Number seq = insert.executeAndReturnKey(params);
        String publicId = "PL-" + String.format("%06d", seq.longValue());
        jdbcTemplate.update("UPDATE payment SET public_id = ? WHERE payment_id = ?", publicId, item.getPaymentId());
        item.setPublicId(publicId);
        item.setPaymentDate(now);
        return item;
    }

    public boolean update(UUID id, Payment item) {
        return jdbcTemplate.update("UPDATE payment SET sale_id = ?, amount = ?, payment_method = ?, payment_status = ? WHERE payment_id = ?", item.getSaleId(), item.getAmount(), item.getPaymentMethod(), item.getPaymentStatus(), id) > 0;
    }

    public boolean delete(UUID id) {
        return jdbcTemplate.update("DELETE FROM payment WHERE payment_id = ?", id) > 0;
    }
}
