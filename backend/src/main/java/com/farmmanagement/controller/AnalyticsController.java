package com.farmmanagement.controller;

import com.farmmanagement.dto.OverviewDto;
import com.farmmanagement.service.AnalyticsService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    private final AnalyticsService service;
    public AnalyticsController(AnalyticsService service) { this.service = service; }

    @GetMapping("/overview")
    @PreAuthorize("hasAnyRole('ADMIN','FARM_MANAGER')")
    public OverviewDto overview() {
        return service.getOverview();
    }
}
