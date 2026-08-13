package com.farmmanagement.service;

import com.farmmanagement.dto.OverviewDto;
import com.farmmanagement.dto.StatCardDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** Powers GET /api/analytics/overview — the broader, admin-only reporting view. */
@Service
public class AnalyticsService {
    private final JdbcTemplate jdbcTemplate;

    public AnalyticsService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public OverviewDto getOverview() {
        BigDecimal revenueYtd = queryDecimal(
                "SELECT COALESCE(SUM(total),0) FROM sale WHERE sale_status IN ('PAID','PARTIALLY_PAID') AND YEAR(sale_date) = YEAR(CURDATE())");
        BigDecimal yieldYtd = queryDecimal(
                "SELECT COALESCE(SUM(quantity),0) FROM harvest WHERE YEAR(harvest_date) = YEAR(CURDATE())");
        int activeFarms = queryInt("SELECT COUNT(*) FROM farm WHERE farm_status = 'ACTIVE'");
        int totalEmployees = queryInt("SELECT COUNT(*) FROM employment WHERE employment_status = 'ACTIVE'");

        List<StatCardDto> stats = List.of(
                new StatCardDto("revenue-ytd", "Total Revenue (YTD)", currency(revenueYtd), null, "neutral", "Across all farms"),
                new StatCardDto("yield-ytd", "Total Harvest Yield (YTD)", yieldYtd.setScale(0, RoundingMode.HALF_UP) + " kg", null, "neutral", "All crops combined"),
                new StatCardDto("active-farms", "Active Farms", String.valueOf(activeFarms), null, "neutral", "Currently operational"),
                new StatCardDto("total-employees", "Total Employees", String.valueOf(totalEmployees), null, "neutral", "Across all farms")
        );

        Map<String, List<Map<String, Object>>> charts = new HashMap<>();
        charts.put("revenueTrend", jdbcTemplate.queryForList(
                "SELECT DATE_FORMAT(sale_date, '%b') AS month, SUM(total) AS revenue FROM sale " +
                        "WHERE sale_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH) " +
                        "GROUP BY DATE_FORMAT(sale_date, '%Y-%m'), DATE_FORMAT(sale_date, '%b') " +
                        "ORDER BY DATE_FORMAT(sale_date, '%Y-%m')"));
        charts.put("harvestYield", jdbcTemplate.queryForList(
                "SELECT DATE_FORMAT(harvest_date, '%b') AS month, SUM(quantity) AS yield FROM harvest " +
                        "WHERE harvest_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH) " +
                        "GROUP BY DATE_FORMAT(harvest_date, '%Y-%m'), DATE_FORMAT(harvest_date, '%b') " +
                        "ORDER BY DATE_FORMAT(harvest_date, '%Y-%m')"));
        charts.put("cropStatus", jdbcTemplate.queryForList(
                "SELECT crop_status AS name, COUNT(*) AS value FROM crop GROUP BY crop_status"));
        charts.put("revenueByFarm", jdbcTemplate.queryForList(
                "SELECT f.farm_name AS farm, COALESCE(SUM(s.total),0) AS revenue FROM farm f " +
                        "LEFT JOIN employment e ON e.farm_id = f.farm_id " +
                        "LEFT JOIN sale s ON s.employment_id = e.employment_id AND s.sale_status IN ('PAID','PARTIALLY_PAID') " +
                        "GROUP BY f.farm_id, f.farm_name ORDER BY revenue DESC"));
        charts.put("paymentStatus", jdbcTemplate.queryForList(
                "SELECT payment_status AS name, COUNT(*) AS value FROM payment GROUP BY payment_status"));
        charts.put("equipmentStatus", jdbcTemplate.queryForList(
                "SELECT equipment_status AS name, COUNT(*) AS value FROM equipment GROUP BY equipment_status"));

        return new OverviewDto(stats, charts);
    }

    private int queryInt(String sql) {
        Integer result = jdbcTemplate.queryForObject(sql, Integer.class);
        return result != null ? result : 0;
    }

    private BigDecimal queryDecimal(String sql) {
        BigDecimal result = jdbcTemplate.queryForObject(sql, BigDecimal.class);
        return result != null ? result : BigDecimal.ZERO;
    }

    private String currency(BigDecimal amount) {
        return "₵ " + amount.setScale(2, RoundingMode.HALF_UP).toPlainString();
    }
}
