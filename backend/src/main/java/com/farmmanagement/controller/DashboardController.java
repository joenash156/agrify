package com.farmmanagement.controller;

import com.farmmanagement.dto.OverviewDto;
import com.farmmanagement.service.DashboardService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService service;
    public DashboardController(DashboardService service) { this.service = service; }

    @GetMapping("/overview")
    public OverviewDto overview(Authentication authentication) {
        return service.getOverview(authentication.getName());
    }
}
