package com.farmmanagement.controller;

import java.util.UUID;

import com.farmmanagement.dto.AttendanceDto;
import com.farmmanagement.dto.ClockInDto;
import com.farmmanagement.dto.ClockInResponseDto;
import com.farmmanagement.model.Attendance;
import com.farmmanagement.service.AttendanceService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
    private final AttendanceService service;

    public AttendanceController(AttendanceService service) { this.service = service; }

    @GetMapping
    public List<Attendance> findAll(Authentication authentication) { return service.findAllForUser(authentication.getName()); }

    @GetMapping("/{id}")
    public Attendance findById(@PathVariable UUID id) { return service.findById(id); }

    // Full-form logging (pick any employee, backdate, set check-out) — admins/managers only.
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN','FARM_MANAGER')")
    public Attendance create(@RequestBody AttendanceDto dto) { return service.create(dto); }

    // Self-service clock-in — the caller may only record attendance for their own account.
    @PostMapping("/clock-in")
    @ResponseStatus(HttpStatus.CREATED)
    public ClockInResponseDto clockIn(@RequestBody ClockInDto dto, Authentication authentication) {
        return service.clockIn(dto.getUsername(), authentication.getName());
    }

    // No PUT/DELETE: attendance is an append-only log once recorded (view-only after that).
}
