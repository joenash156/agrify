package com.farmmanagement.dto;

import java.util.List;
import java.util.Map;

/** Generic envelope for the dashboard/analytics overview endpoints. */
public class OverviewDto {
    private List<StatCardDto> stats;
    private Map<String, List<Map<String, Object>>> charts;

    public OverviewDto() {}

    public OverviewDto(List<StatCardDto> stats, Map<String, List<Map<String, Object>>> charts) {
        this.stats = stats;
        this.charts = charts;
    }

    public List<StatCardDto> getStats() { return stats; }
    public void setStats(List<StatCardDto> stats) { this.stats = stats; }
    public Map<String, List<Map<String, Object>>> getCharts() { return charts; }
    public void setCharts(Map<String, List<Map<String, Object>>> charts) { this.charts = charts; }
}
