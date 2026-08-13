package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.SaleDao;
import com.farmmanagement.model.Sale;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcSaleDao implements SaleDao {
    private final JdbcTemplate jdbcTemplate;

    public JdbcSaleDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Sale> findAll() {
        return jdbcTemplate.query("SELECT * FROM sale", BeanPropertyRowMapper.newInstance(Sale.class));
    }

    public Optional<Sale> findById(UUID id) {
        List<Sale> result = jdbcTemplate.query("SELECT * FROM sale WHERE sale_id = ?", BeanPropertyRowMapper.newInstance(Sale.class), id);
        return result.stream().findFirst();
    }

    public Sale save(Sale item) {
        jdbcTemplate.update("INSERT INTO sale (sale_id, customer_id, total, sale_status) VALUES (?, ?, ?, ?)", item.getSaleId(), item.getCustomerId(), item.getTotal(), item.getSaleStatus());
        return item;
    }

    public boolean update(UUID id, Sale item) {
        return jdbcTemplate.update("UPDATE sale SET customer_id = ?, total = ?, sale_status = ? WHERE sale_id = ?", item.getCustomerId(), item.getTotal(), item.getSaleStatus(), id) > 0;
    }

    public boolean delete(UUID id) {
        return jdbcTemplate.update("DELETE FROM sale WHERE sale_id = ?", id) > 0;
    }
}
