package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.SaleDao;
import com.farmmanagement.dto.SaleSummaryDto;
import com.farmmanagement.model.Sale;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class JdbcSaleDao implements SaleDao {
    private final JdbcTemplate jdbcTemplate;
    private final SimpleJdbcInsert insert;

    public JdbcSaleDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        // usingColumns pins the insert to exactly these columns — without it, SimpleJdbcInsert
        // writes every table column explicitly (NULL for anything not in the params map), which
        // stomps on is_voided/sale_date's DEFAULTs instead of leaving them to the database.
        this.insert = new SimpleJdbcInsert(jdbcTemplate).withTableName("sale").usingGeneratedKeyColumns("sale_seq")
                .usingColumns("sale_id", "customer_id", "employment_id", "sale_date", "total", "sale_status", "public_id");
    }

    // BeanPropertyRowMapper can't reliably match a boolean is_voided column to the
    // isVoided()/setVoided() JavaBean property pair (whose inferred property name is
    // "voided", not "isVoided"), so this DAO maps Sale explicitly instead.
    private static final RowMapper<Sale> SALE_ROW_MAPPER = (rs, rowNum) -> {
        Sale sale = new Sale();
        sale.setSaleId(UUID.fromString(rs.getString("sale_id")));
        sale.setPublicId(rs.getString("public_id"));
        sale.setCustomerId(rs.getString("customer_id") != null ? UUID.fromString(rs.getString("customer_id")) : null);
        sale.setEmploymentId(UUID.fromString(rs.getString("employment_id")));
        sale.setSaleDate(rs.getTimestamp("sale_date").toLocalDateTime());
        sale.setTotal(rs.getBigDecimal("total"));
        sale.setSaleStatus(rs.getString("sale_status"));
        sale.setVoided(rs.getBoolean("is_voided"));
        Timestamp voidedAt = rs.getTimestamp("is_voided_at");
        sale.setVoidedAt(voidedAt != null ? voidedAt.toLocalDateTime() : null);
        sale.setVoidedReason(rs.getString("voided_reason"));
        sale.setVoidedBy(rs.getString("voided_by") != null ? UUID.fromString(rs.getString("voided_by")) : null);
        return sale;
    };

    public List<Sale> findAll() {
        return jdbcTemplate.query("SELECT * FROM sale", SALE_ROW_MAPPER);
    }

    public Optional<Sale> findById(UUID id) {
        List<Sale> result = jdbcTemplate.query("SELECT * FROM sale WHERE sale_id = ?", SALE_ROW_MAPPER, id);
        return result.stream().findFirst();
    }

    public List<SaleSummaryDto> findAllWithDetails(UUID employmentId) {
        String sql = "SELECT s.sale_id, s.public_id, s.customer_id, CONCAT(c.first_name, ' ', c.last_name) AS customer_name, " +
                "s.employment_id, CONCAT(u.first_name, ' ', u.last_name) AS sold_by_name, " +
                "s.sale_date, s.total, s.sale_status, " +
                "(SELECT COUNT(*) FROM sale_item si WHERE si.sale_id = s.sale_id) AS item_count, " +
                "s.is_voided, s.is_voided_at, s.voided_reason, CONCAT(voider.first_name, ' ', voider.last_name) AS voided_by_name " +
                "FROM sale s " +
                "LEFT JOIN customer c ON s.customer_id = c.customer_id " +
                "JOIN employment e ON s.employment_id = e.employment_id " +
                "JOIN app_user u ON e.user_id = u.user_id " +
                "LEFT JOIN app_user voider ON s.voided_by = voider.user_id " +
                (employmentId != null ? "WHERE s.employment_id = ? " : "") +
                "ORDER BY s.sale_date DESC";
        RowMapper<SaleSummaryDto> mapper = (rs, rowNum) -> {
            Timestamp voidedAt = rs.getTimestamp("is_voided_at");
            return new SaleSummaryDto(
                    UUID.fromString(rs.getString("sale_id")),
                    rs.getString("public_id"),
                    rs.getString("customer_id") != null ? UUID.fromString(rs.getString("customer_id")) : null,
                    rs.getString("customer_name"),
                    UUID.fromString(rs.getString("employment_id")),
                    rs.getString("sold_by_name"),
                    rs.getTimestamp("sale_date").toLocalDateTime(),
                    rs.getBigDecimal("total"),
                    rs.getString("sale_status"),
                    rs.getInt("item_count"),
                    rs.getBoolean("is_voided"),
                    voidedAt != null ? voidedAt.toLocalDateTime() : null,
                    rs.getString("voided_reason"),
                    rs.getString("voided_by_name")
            );
        };
        return employmentId != null
                ? jdbcTemplate.query(sql, mapper, employmentId)
                : jdbcTemplate.query(sql, mapper);
    }

    public Sale save(Sale item) {
        // SimpleJdbcInsert only writes columns present in this map — unlike a plain INSERT that
        // omits a column entirely, it doesn't fall back to the column's DEFAULT CURRENT_TIMESTAMP,
        // so sale_date has to be set explicitly here or it lands as NULL and violates NOT NULL.
        LocalDateTime now = LocalDateTime.now();
        Map<String, Object> params = new HashMap<>();
        params.put("sale_id", item.getSaleId());
        params.put("customer_id", item.getCustomerId());
        params.put("employment_id", item.getEmploymentId());
        params.put("sale_date", now);
        params.put("total", item.getTotal());
        params.put("sale_status", item.getSaleStatus());
        params.put("public_id", "");
        Number seq = insert.executeAndReturnKey(params);
        String publicId = "SL-" + String.format("%06d", seq.longValue());
        jdbcTemplate.update("UPDATE sale SET public_id = ? WHERE sale_id = ?", publicId, item.getSaleId());
        item.setPublicId(publicId);
        item.setSaleDate(now);
        return item;
    }

    public boolean update(UUID id, Sale item) {
        return jdbcTemplate.update("UPDATE sale SET customer_id = ?, employment_id = ?, total = ?, sale_status = ? WHERE sale_id = ?",
                item.getCustomerId(), item.getEmploymentId(), item.getTotal(), item.getSaleStatus(), id) > 0;
    }

    public boolean delete(UUID id) {
        return jdbcTemplate.update("DELETE FROM sale WHERE sale_id = ?", id) > 0;
    }

    public void voidSale(UUID saleId, String reason, UUID voidedByUserId, LocalDateTime voidedAt) {
        jdbcTemplate.update(
                "UPDATE sale SET is_voided = TRUE, is_voided_at = ?, voided_reason = ?, voided_by = ? WHERE sale_id = ?",
                voidedAt, reason, voidedByUserId, saleId);
    }
}
