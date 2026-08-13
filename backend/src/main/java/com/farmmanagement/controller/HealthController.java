package com.farmmanagement.controller;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class HealthController {
    @GetMapping
    public Map<String, Object> status() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", true);
        response.put("message", "The Agrify backend server is running");
        return response;
    }
}
