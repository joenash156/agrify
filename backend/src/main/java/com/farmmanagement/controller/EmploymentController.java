package com.farmmanagement.controller;

import java.util.UUID;

import com.farmmanagement.dto.EmploymentDto;
import com.farmmanagement.model.Employment;
import com.farmmanagement.service.EmploymentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/employment")
public class EmploymentController {
    private final EmploymentService service;

    public EmploymentController(EmploymentService service) { this.service = service; }

    @GetMapping
    public List<Employment> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public Employment findById(@PathVariable UUID id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Employment create(@RequestBody EmploymentDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public Employment update(@PathVariable UUID id, @RequestBody EmploymentDto dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
