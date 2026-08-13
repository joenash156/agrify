package com.farmmanagement.service;

import com.farmmanagement.dao.UserAccountDao;
import com.farmmanagement.dto.OverviewDto;
import com.farmmanagement.dto.StatCardDto;
import com.farmmanagement.model.UserAccount;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Powers GET /api/dashboard/overview. Every figure here is computed with a
 * dedicated raw SQL aggregate query (no ORM) — the exact charts/stats shown
 * depend on the caller's role, matching the frontend's per-role dashboard.
 */
@Service
public class DashboardService {
    private final JdbcTemplate jdbcTemplate;
    private final UserAccountDao userAccountDao;

    public DashboardService(JdbcTemplate jdbcTemplate, UserAccountDao userAccountDao) {
        this.jdbcTemplate = jdbcTemplate;
        this.userAccountDao = userAccountDao;
    }

    public OverviewDto getOverview(String username) {
        UserAccount account = userAccountDao.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        String role = account.getRole();

        if ("ADMIN".equals(role) || "FARM_MANAGER".equals(role)) {
            return adminOverview();
        }

        Map<String, Object> employment = jdbcTemplate.queryForList(
                "SELECT employment_id, farm_id FROM employment WHERE user_id = ? AND employment_status = 'ACTIVE' LIMIT 1",
                account.getUserId()
        ).stream().findFirst().orElse(null);

        if (employment == null) {
            return new OverviewDto(List.of(), Map.of());
        }
        UUID employmentId = UUID.fromString((String) employment.get("employment_id"));
        UUID farmId = UUID.fromString((String) employment.get("farm_id"));

        if ("SALES_PERSON".equals(role)) {
            return salesPersonOverview(employmentId);
        }
        return workerOverview(employmentId, farmId);
    }

    private OverviewDto adminOverview() {
        int farmCount = queryInt("SELECT COUNT(*) FROM farm");
        int activeEmployees = queryInt("SELECT COUNT(*) FROM employment WHERE employment_status = 'ACTIVE'");
        int activeCrops = queryInt("SELECT COUNT(*) FROM crop WHERE crop_status IN ('GROWING','READY')");
        int harvestsThisMonth = queryInt(
                "SELECT COUNT(*) FROM harvest WHERE MONTH(harvest_date) = MONTH(CURDATE()) AND YEAR(harvest_date) = YEAR(CURDATE())");
        int inventoryItems = queryInt("SELECT COUNT(*) FROM inventory");
        BigDecimal salesThisMonth = queryDecimal(
                "SELECT COALESCE(SUM(total),0) FROM sale WHERE sale_status IN ('PAID','PARTIALLY_PAID') " +
                        "AND MONTH(sale_date) = MONTH(CURDATE()) AND YEAR(sale_date) = YEAR(CURDATE())");
        BigDecimal outstandingPayments = queryDecimal(
                "SELECT COALESCE(SUM(total),0) FROM sale WHERE sale_status IN ('UNPAID','PARTIALLY_PAID')");
        int equipmentUnits = queryInt("SELECT COUNT(*) FROM equipment");

        List<StatCardDto> stats = new ArrayList<>();
        stats.add(new StatCardDto("farms", "Total Farms", String.valueOf(farmCount), null, "neutral", "Registered farms"));
        stats.add(new StatCardDto("employees", "Active Employees", String.valueOf(activeEmployees), null, "neutral", "Across all farms"));
        stats.add(new StatCardDto("crops", "Active Crops", String.valueOf(activeCrops), null, "neutral", "Growing or ready for harvest"));
        stats.add(new StatCardDto("harvests", "Harvests This Month", String.valueOf(harvestsThisMonth), null, "neutral", "Recorded this month"));
        stats.add(new StatCardDto("inventory", "Inventory Items", String.valueOf(inventoryItems), null, "neutral", "Stored batches"));
        stats.add(new StatCardDto("sales", "Sales This Month", currency(salesThisMonth), null, "neutral", "Paid + partially paid"));
        stats.add(new StatCardDto("payments", "Outstanding Payments", currency(outstandingPayments), null, "neutral", "Unpaid + partially paid"));
        stats.add(new StatCardDto("equipment", "Equipment Units", String.valueOf(equipmentUnits), null, "neutral", "Registered equipment"));

        Map<String, List<Map<String, Object>>> charts = new HashMap<>();
        charts.put("salesChart", jdbcTemplate.queryForList(
                "SELECT DATE_FORMAT(sale_date, '%b') AS month, SUM(total) AS revenue FROM sale " +
                        "WHERE sale_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) " +
                        "GROUP BY DATE_FORMAT(sale_date, '%Y-%m'), DATE_FORMAT(sale_date, '%b') " +
                        "ORDER BY DATE_FORMAT(sale_date, '%Y-%m')"));
        charts.put("harvestChart", jdbcTemplate.queryForList(
                "SELECT DATE_FORMAT(harvest_date, '%b') AS month, SUM(quantity) AS yield FROM harvest " +
                        "WHERE harvest_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) " +
                        "GROUP BY DATE_FORMAT(harvest_date, '%Y-%m'), DATE_FORMAT(harvest_date, '%b') " +
                        "ORDER BY DATE_FORMAT(harvest_date, '%Y-%m')"));
        charts.put("cropStatusChart", jdbcTemplate.queryForList(
                "SELECT crop_status AS name, COUNT(*) AS value FROM crop GROUP BY crop_status"));

        return new OverviewDto(stats, charts);
    }

    private OverviewDto salesPersonOverview(UUID employmentId) {
        BigDecimal myRevenue = queryDecimal(
                "SELECT COALESCE(SUM(total),0) FROM sale WHERE employment_id = ? " +
                        "AND MONTH(sale_date) = MONTH(CURDATE()) AND YEAR(sale_date) = YEAR(CURDATE())", employmentId);
        int myOrders = queryInt("SELECT COUNT(*) FROM sale WHERE employment_id = ?", employmentId);
        int pendingOrders = queryInt("SELECT COUNT(*) FROM sale WHERE employment_id = ? AND sale_status = 'UNPAID'", employmentId);
        int availableInventory = queryInt("SELECT COUNT(*) FROM inventory WHERE quantity > 0");

        List<StatCardDto> stats = List.of(
                new StatCardDto("sales", "My Sales This Month", currency(myRevenue), null, "neutral", "Across all my orders"),
                new StatCardDto("orders", "My Total Orders", String.valueOf(myOrders), null, "neutral", "All time"),
                new StatCardDto("pending", "Pending Orders", String.valueOf(pendingOrders), null, "neutral", "Awaiting payment"),
                new StatCardDto("inventory", "Available Inventory", String.valueOf(availableInventory), null, "neutral", "Items ready to sell")
        );

        Map<String, List<Map<String, Object>>> charts = new HashMap<>();
        charts.put("mySalesTrend", jdbcTemplate.queryForList(
                "SELECT DATE_FORMAT(sale_date, '%b') AS month, SUM(total) AS revenue FROM sale " +
                        "WHERE employment_id = ? AND sale_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) " +
                        "GROUP BY DATE_FORMAT(sale_date, '%Y-%m'), DATE_FORMAT(sale_date, '%b') " +
                        "ORDER BY DATE_FORMAT(sale_date, '%Y-%m')", employmentId));
        charts.put("myOrderStatus", jdbcTemplate.queryForList(
                "SELECT sale_status AS name, COUNT(*) AS value FROM sale WHERE employment_id = ? GROUP BY sale_status", employmentId));

        return new OverviewDto(stats, charts);
    }

    private OverviewDto workerOverview(UUID employmentId, UUID farmId) {
        int assignedCrops = queryInt("SELECT COUNT(*) FROM crop WHERE farm_id = ?", farmId);
        int presentDays = queryInt(
                "SELECT COUNT(*) FROM attendance WHERE employment_id = ? AND attendance_status = 'PRESENT' " +
                        "AND attendance_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)", employmentId);
        int totalDaysTracked = queryInt(
                "SELECT COUNT(*) FROM attendance WHERE employment_id = ? AND attendance_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)", employmentId);
        int equipmentAssigned = queryInt(
                "SELECT COUNT(DISTINCT equipment_id) FROM equipment_usage WHERE employment_id = ?", employmentId);

        List<StatCardDto> stats = List.of(
                new StatCardDto("crops", "Crops At My Farm", String.valueOf(assignedCrops), null, "neutral", "Across all statuses"),
                new StatCardDto("equipment", "Equipment Used", String.valueOf(equipmentAssigned), null, "neutral", "Distinct equipment operated"),
                new StatCardDto("attendance", "Attendance (30 days)", presentDays + " / " + totalDaysTracked, null, "neutral", "Days present"),
                new StatCardDto("harvests", "Farm Harvests", String.valueOf(queryInt(
                        "SELECT COUNT(*) FROM harvest h JOIN crop c ON h.crop_id = c.crop_id WHERE c.farm_id = ?", farmId)),
                        null, "neutral", "Recorded at my farm")
        );

        Map<String, List<Map<String, Object>>> charts = new HashMap<>();
        charts.put("myAttendance", jdbcTemplate.queryForList(
                "SELECT attendance_status AS status, COUNT(*) AS count FROM attendance " +
                        "WHERE employment_id = ? AND attendance_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) " +
                        "GROUP BY attendance_status", employmentId));
        charts.put("myCropsStatus", jdbcTemplate.queryForList(
                "SELECT crop_status AS name, COUNT(*) AS value FROM crop WHERE farm_id = ? GROUP BY crop_status", farmId));

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
        return "₵ " + amount.setScale(2, java.math.RoundingMode.HALF_UP).toPlainString();
    }
}
