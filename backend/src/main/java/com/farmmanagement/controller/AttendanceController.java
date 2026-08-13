package com.farmmanagement.controller;

import java.util.UUID;

import com.farmmanagement.dto.AttendanceDto;
import com.farmmanagement.model.Attendance;
import com.farmmanagement.service.AttendanceService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
    private final AttendanceService service;

    public AttendanceController(AttendanceService service) { this.service = service; }

    @GetMapping
    public List<Attendance> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public Attendance findById(@PathVariable UUID id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Attendance create(@RequestBody AttendanceDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public Attendance update(@PathVariable UUID id, @RequestBody AttendanceDto dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
