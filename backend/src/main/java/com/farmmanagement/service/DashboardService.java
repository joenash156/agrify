package com.farmmanagement.service;

import com.farmmanagement.dao.UserAccountDao;
import com.farmmanagement.dto.OverviewDto;
import com.farmmanagement.dto.StatCardDto;
import com.farmmanagement.model.UserAccount;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Powers GET /api/dashboard/overview. Every figure here is computed with a
 * dedicated raw SQL aggregate query (no ORM) — the exact charts/stats shown
 * depend on the caller's role, matching the frontend's per-role dashboard.
 *
 * Every date-stamped metric (sales, harvests, attendance) is scoped to the
 * caller's selected [from, to] range so stats and charts stay in sync with
 * the dashboard's date-range filter. Point-in-time snapshots (active counts,
 * current status breakdowns, outstanding balances) intentionally ignore the
 * range — "how many farms exist right now" has no meaningful date window.
 */
@Service
public class DashboardService {
    private final JdbcTemplate jdbcTemplate;
    private final UserAccountDao userAccountDao;

    private static final LocalDate EARLIEST = LocalDate.of(2000, 1, 1);
    private static final LocalDate LATEST = LocalDate.of(2100, 12, 31);

    public DashboardService(JdbcTemplate jdbcTemplate, UserAccountDao userAccountDao) {
        this.jdbcTemplate = jdbcTemplate;
        this.userAccountDao = userAccountDao;
    }

    public OverviewDto getOverview(String username, LocalDate from, LocalDate to) {
        LocalDate rangeFrom = from != null ? from : EARLIEST;
        LocalDate rangeTo = to != null ? to : LATEST;
        // sale_date/payment_date are TIMESTAMP columns — bounding them with a bare LocalDate
        // upper bound would mean "<= midnight of that day", silently excluding that whole day.
        LocalDateTime tsFrom = rangeFrom.atStartOfDay();
        LocalDateTime tsTo = rangeTo.atTime(LocalTime.MAX);

        UserAccount account = userAccountDao.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        String role = account.getRole();

        if ("ADMIN".equals(role) || "FARM_MANAGER".equals(role)) {
            return adminOverview(rangeFrom, rangeTo, tsFrom, tsTo);
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
            return salesPersonOverview(employmentId, tsFrom, tsTo);
        }
        return workerOverview(employmentId, farmId, rangeFrom, rangeTo);
    }

    private OverviewDto adminOverview(LocalDate from, LocalDate to, LocalDateTime tsFrom, LocalDateTime tsTo) {
        int farmCount = queryInt("SELECT COUNT(*) FROM farm");
        int activeEmployees = queryInt("SELECT COUNT(*) FROM employment WHERE employment_status = 'ACTIVE'");
        int activeCrops = queryInt("SELECT COUNT(*) FROM crop WHERE crop_status IN ('GROWING','READY')");
        int harvestsInRange = queryInt(
                "SELECT COUNT(*) FROM harvest WHERE harvest_date BETWEEN ? AND ?", from, to);
        int inventoryItems = queryInt("SELECT COUNT(*) FROM inventory");
        BigDecimal salesInRange = queryDecimal(
                "SELECT COALESCE(SUM(total),0) FROM sale WHERE sale_status IN ('PAID','PARTIALLY_PAID') " +
                        "AND is_voided = 0 AND sale_date BETWEEN ? AND ?", tsFrom, tsTo);
        BigDecimal outstandingPayments = queryDecimal(
                "SELECT COALESCE(SUM(total),0) FROM sale WHERE sale_status IN ('UNPAID','PARTIALLY_PAID') AND is_voided = 0");
        int equipmentUnits = queryInt("SELECT COUNT(*) FROM equipment");

        List<StatCardDto> stats = new ArrayList<>();
        stats.add(new StatCardDto("farms", "Total Farms", String.valueOf(farmCount), null, "neutral", "Registered farms"));
        stats.add(new StatCardDto("employees", "Active Employees", String.valueOf(activeEmployees), null, "neutral", "Across all farms"));
        stats.add(new StatCardDto("crops", "Active Crops", String.valueOf(activeCrops), null, "neutral", "Growing or ready for harvest"));
        stats.add(new StatCardDto("harvests", "Harvests in Period", String.valueOf(harvestsInRange), null, "neutral", "Recorded in selected range"));
        stats.add(new StatCardDto("inventory", "Inventory Items", String.valueOf(inventoryItems), null, "neutral", "Stored batches"));
        stats.add(new StatCardDto("sales", "Sales in Period", currency(salesInRange), null, "neutral", "Paid + partially paid"));
        stats.add(new StatCardDto("payments", "Outstanding Payments", currency(outstandingPayments), null, "neutral", "Unpaid + partially paid"));
        stats.add(new StatCardDto("equipment", "Equipment Units", String.valueOf(equipmentUnits), null, "neutral", "Registered equipment"));

        Map<String, List<Map<String, Object>>> charts = new HashMap<>();
        charts.put("salesChart", jdbcTemplate.queryForList(
                "SELECT DATE_FORMAT(sale_date, '%b %e') AS month, SUM(total) AS revenue FROM sale " +
                        "WHERE is_voided = 0 AND sale_date BETWEEN ? AND ? " +
                        "GROUP BY DATE_FORMAT(sale_date, '%Y-%m-%d'), DATE_FORMAT(sale_date, '%b %e') " +
                        "ORDER BY DATE_FORMAT(sale_date, '%Y-%m-%d')", tsFrom, tsTo));
        charts.put("harvestChart", jdbcTemplate.queryForList(
                "SELECT DATE_FORMAT(harvest_date, '%b %e') AS month, SUM(quantity) AS yield FROM harvest " +
                        "WHERE harvest_date BETWEEN ? AND ? " +
                        "GROUP BY DATE_FORMAT(harvest_date, '%Y-%m-%d'), DATE_FORMAT(harvest_date, '%b %e') " +
                        "ORDER BY DATE_FORMAT(harvest_date, '%Y-%m-%d')", from, to));
        charts.put("cropStatusChart", jdbcTemplate.queryForList(
                "SELECT crop_status AS name, COUNT(*) AS value FROM crop GROUP BY crop_status"));

        return new OverviewDto(stats, charts);
    }

    private OverviewDto salesPersonOverview(UUID employmentId, LocalDateTime from, LocalDateTime to) {
        BigDecimal myRevenue = queryDecimal(
                "SELECT COALESCE(SUM(total),0) FROM sale WHERE employment_id = ? AND is_voided = 0 " +
                        "AND sale_date BETWEEN ? AND ?", employmentId, from, to);
        int myOrders = queryInt(
                "SELECT COUNT(*) FROM sale WHERE employment_id = ? AND is_voided = 0 AND sale_date BETWEEN ? AND ?",
                employmentId, from, to);
        int pendingOrders = queryInt(
                "SELECT COUNT(*) FROM sale WHERE employment_id = ? AND sale_status = 'UNPAID' AND is_voided = 0", employmentId);
        int availableInventory = queryInt("SELECT COUNT(*) FROM inventory WHERE quantity > 0");

        List<StatCardDto> stats = List.of(
                new StatCardDto("sales", "My Sales in Period", currency(myRevenue), null, "neutral", "Across my orders in range"),
                new StatCardDto("orders", "My Orders in Period", String.valueOf(myOrders), null, "neutral", "In selected range"),
                new StatCardDto("pending", "Pending Orders", String.valueOf(pendingOrders), null, "neutral", "Awaiting payment"),
                new StatCardDto("inventory", "Available Inventory", String.valueOf(availableInventory), null, "neutral", "Items ready to sell")
        );

        Map<String, List<Map<String, Object>>> charts = new HashMap<>();
        charts.put("mySalesTrend", jdbcTemplate.queryForList(
                "SELECT DATE_FORMAT(sale_date, '%b %e') AS month, SUM(total) AS revenue FROM sale " +
                        "WHERE employment_id = ? AND is_voided = 0 AND sale_date BETWEEN ? AND ? " +
                        "GROUP BY DATE_FORMAT(sale_date, '%Y-%m-%d'), DATE_FORMAT(sale_date, '%b %e') " +
                        "ORDER BY DATE_FORMAT(sale_date, '%Y-%m-%d')", employmentId, from, to));
        charts.put("myOrderStatus", jdbcTemplate.queryForList(
                "SELECT sale_status AS name, COUNT(*) AS value FROM sale " +
                        "WHERE employment_id = ? AND is_voided = 0 AND sale_date BETWEEN ? AND ? GROUP BY sale_status",
                employmentId, from, to));

        return new OverviewDto(stats, charts);
    }

    private OverviewDto workerOverview(UUID employmentId, UUID farmId, LocalDate from, LocalDate to) {
        int assignedCrops = queryInt("SELECT COUNT(*) FROM crop WHERE farm_id = ?", farmId);
        int presentDays = queryInt(
                "SELECT COUNT(*) FROM attendance WHERE employment_id = ? AND attendance_status = 'PRESENT' " +
                        "AND attendance_date BETWEEN ? AND ?", employmentId, from, to);
        int totalDaysTracked = queryInt(
                "SELECT COUNT(*) FROM attendance WHERE employment_id = ? AND attendance_date BETWEEN ? AND ?",
                employmentId, from, to);
        int equipmentAssigned = queryInt(
                "SELECT COUNT(DISTINCT equipment_id) FROM equipment_usage WHERE employment_id = ?", employmentId);
        int farmHarvests = queryInt(
                "SELECT COUNT(*) FROM harvest h JOIN crop c ON h.crop_id = c.crop_id " +
                        "WHERE c.farm_id = ? AND h.harvest_date BETWEEN ? AND ?", farmId, from, to);

        List<StatCardDto> stats = List.of(
                new StatCardDto("crops", "Crops At My Farm", String.valueOf(assignedCrops), null, "neutral", "Across all statuses"),
                new StatCardDto("equipment", "Equipment Used", String.valueOf(equipmentAssigned), null, "neutral", "Distinct equipment operated"),
                new StatCardDto("attendance", "Attendance in Period", presentDays + " / " + totalDaysTracked, null, "neutral", "Days present"),
                new StatCardDto("harvests", "Farm Harvests", String.valueOf(farmHarvests), null, "neutral", "Recorded in selected range")
        );

        Map<String, List<Map<String, Object>>> charts = new HashMap<>();
        charts.put("myAttendance", jdbcTemplate.queryForList(
                "SELECT attendance_status AS status, COUNT(*) AS count FROM attendance " +
                        "WHERE employment_id = ? AND attendance_date BETWEEN ? AND ? " +
                        "GROUP BY attendance_status", employmentId, from, to));
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
