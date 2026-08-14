package com.farmmanagement.service;

import com.farmmanagement.dto.OverviewDto;
import com.farmmanagement.dto.StatCardDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** Powers GET /api/analytics/overview — the broader, admin-only reporting view. */
@Service
public class AnalyticsService {
    private final JdbcTemplate jdbcTemplate;

    private static final LocalDate EARLIEST = LocalDate.of(2000, 1, 1);
    private static final LocalDate LATEST = LocalDate.of(2100, 12, 31);

    public AnalyticsService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public OverviewDto getOverview(LocalDate from, LocalDate to) {
        LocalDate rangeFrom = from != null ? from : EARLIEST;
        LocalDate rangeTo = to != null ? to : LATEST;
        // sale_date/payment_date are TIMESTAMP columns — bounding them with a bare LocalDate
        // upper bound would mean "<= midnight of that day", silently excluding that whole day.
        LocalDateTime tsFrom = rangeFrom.atStartOfDay();
        LocalDateTime tsTo = rangeTo.atTime(LocalTime.MAX);

        BigDecimal revenueInRange = queryDecimal(
                "SELECT COALESCE(SUM(total),0) FROM sale WHERE sale_status IN ('PAID','PARTIALLY_PAID') " +
                        "AND is_voided = 0 AND sale_date BETWEEN ? AND ?", tsFrom, tsTo);
        BigDecimal yieldInRange = queryDecimal(
                "SELECT COALESCE(SUM(quantity),0) FROM harvest WHERE harvest_date BETWEEN ? AND ?", rangeFrom, rangeTo);
        int activeFarms = queryInt("SELECT COUNT(*) FROM farm WHERE farm_status = 'ACTIVE'");
        int totalEmployees = queryInt("SELECT COUNT(*) FROM employment WHERE employment_status = 'ACTIVE'");

        List<StatCardDto> stats = List.of(
                new StatCardDto("revenue-ytd", "Total Revenue", currency(revenueInRange), null, "neutral", "In selected range"),
                new StatCardDto("yield-ytd", "Total Harvest Yield", yieldInRange.setScale(0, RoundingMode.HALF_UP) + " kg", null, "neutral", "In selected range"),
                new StatCardDto("active-farms", "Active Farms", String.valueOf(activeFarms), null, "neutral", "Currently operational"),
                new StatCardDto("total-employees", "Total Employees", String.valueOf(totalEmployees), null, "neutral", "Across all farms")
        );

        Map<String, List<Map<String, Object>>> charts = new HashMap<>();
        charts.put("revenueTrend", jdbcTemplate.queryForList(
                "SELECT DATE_FORMAT(sale_date, '%b %e') AS month, SUM(total) AS revenue FROM sale " +
                        "WHERE is_voided = 0 AND sale_date BETWEEN ? AND ? " +
                        "GROUP BY DATE_FORMAT(sale_date, '%Y-%m-%d'), DATE_FORMAT(sale_date, '%b %e') " +
                        "ORDER BY DATE_FORMAT(sale_date, '%Y-%m-%d')", tsFrom, tsTo));
        charts.put("harvestYield", jdbcTemplate.queryForList(
                "SELECT DATE_FORMAT(harvest_date, '%b %e') AS month, SUM(quantity) AS yield FROM harvest " +
                        "WHERE harvest_date BETWEEN ? AND ? " +
                        "GROUP BY DATE_FORMAT(harvest_date, '%Y-%m-%d'), DATE_FORMAT(harvest_date, '%b %e') " +
                        "ORDER BY DATE_FORMAT(harvest_date, '%Y-%m-%d')", rangeFrom, rangeTo));
        charts.put("cropStatus", jdbcTemplate.queryForList(
                "SELECT crop_status AS name, COUNT(*) AS value FROM crop GROUP BY crop_status"));
        charts.put("revenueByFarm", jdbcTemplate.queryForList(
                "SELECT f.farm_name AS farm, COALESCE(SUM(s.total),0) AS revenue FROM farm f " +
                        "LEFT JOIN employment e ON e.farm_id = f.farm_id " +
                        "LEFT JOIN sale s ON s.employment_id = e.employment_id AND s.sale_status IN ('PAID','PARTIALLY_PAID') " +
                        "AND s.is_voided = 0 AND s.sale_date BETWEEN ? AND ? " +
                        "GROUP BY f.farm_id, f.farm_name ORDER BY revenue DESC", tsFrom, tsTo));
        charts.put("paymentStatus", jdbcTemplate.queryForList(
                "SELECT payment_status AS name, COUNT(*) AS value FROM payment " +
                        "WHERE payment_date BETWEEN ? AND ? GROUP BY payment_status", tsFrom, tsTo));
        charts.put("equipmentStatus", jdbcTemplate.queryForList(
                "SELECT equipment_status AS name, COUNT(*) AS value FROM equipment GROUP BY equipment_status"));

        return new OverviewDto(stats, charts);
    }

    private int queryInt(String sql, Object... args) {
        Integer result = jdbcTemplate.queryForObject(sql, Integer.class, args);
        return result != null ? result : 0;
    }

    private BigDecimal queryDecimal(String sql, Object... args) {
        BigDecimal result = jdbcTemplate.queryForObject(sql, BigDecimal.class, args);
        return result != null ? result : BigDecimal.ZERO;
    }

    private String currency(BigDecimal amount) {
        return "₵ " + amount.setScale(2, RoundingMode.HALF_UP).toPlainString();
    }
}
