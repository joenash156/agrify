package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.SaleDao;
import com.farmmanagement.dto.SaleSummaryDto;
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

    public List<SaleSummaryDto> findAllWithDetails() {
        String sql = "SELECT s.sale_id, s.customer_id, CONCAT(c.first_name, ' ', c.last_name) AS customer_name, " +
                "s.employment_id, CONCAT(u.first_name, ' ', u.last_name) AS sold_by_name, " +
                "s.sale_date, s.total, s.sale_status, " +
                "(SELECT COUNT(*) FROM sale_item si WHERE si.sale_id = s.sale_id) AS item_count " +
                "FROM sale s " +
                "LEFT JOIN customer c ON s.customer_id = c.customer_id " +
                "JOIN employment e ON s.employment_id = e.employment_id " +
                "JOIN app_user u ON e.user_id = u.user_id " +
                "ORDER BY s.sale_date DESC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> new SaleSummaryDto(
                UUID.fromString(rs.getString("sale_id")),
                rs.getString("customer_id") != null ? UUID.fromString(rs.getString("customer_id")) : null,
                rs.getString("customer_name"),
                UUID.fromString(rs.getString("employment_id")),
                rs.getString("sold_by_name"),
                rs.getTimestamp("sale_date").toLocalDateTime(),
                rs.getBigDecimal("total"),
                rs.getString("sale_status"),
                rs.getInt("item_count")
        ));
    }

    public Sale save(Sale item) {
        jdbcTemplate.update("INSERT INTO sale (sale_id, customer_id, employment_id, total, sale_status) VALUES (?, ?, ?, ?, ?)",
                item.getSaleId(), item.getCustomerId(), item.getEmploymentId(), item.getTotal(), item.getSaleStatus());
        return item;
    }

    public boolean update(UUID id, Sale item) {
        return jdbcTemplate.update("UPDATE sale SET customer_id = ?, employment_id = ?, total = ?, sale_status = ? WHERE sale_id = ?",
                item.getCustomerId(), item.getEmploymentId(), item.getTotal(), item.getSaleStatus(), id) > 0;
    }

    public boolean delete(UUID id) {
        return jdbcTemplate.update("DELETE FROM sale WHERE sale_id = ?", id) > 0;
    }
}
