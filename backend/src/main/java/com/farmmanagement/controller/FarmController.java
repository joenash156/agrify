package com.farmmanagement.controller;

import java.util.UUID;

import com.farmmanagement.dto.FarmDto;
import com.farmmanagement.model.Farm;
import com.farmmanagement.service.FarmService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/farm")
public class FarmController {
    private final FarmService service;

    public FarmController(FarmService service) { this.service = service; }

    @GetMapping
    public List<Farm> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public Farm findById(@PathVariable UUID id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Farm create(@RequestBody FarmDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public Farm update(@PathVariable UUID id, @RequestBody FarmDto dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
