package com.farmmanagement.controller;

import java.util.UUID;

import com.farmmanagement.dto.HarvestDto;
import com.farmmanagement.model.Harvest;
import com.farmmanagement.service.HarvestService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/harvest")
public class HarvestController {
    private final HarvestService service;

    public HarvestController(HarvestService service) { this.service = service; }

    @GetMapping
    public List<Harvest> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public Harvest findById(@PathVariable UUID id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Harvest create(@RequestBody HarvestDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public Harvest update(@PathVariable UUID id, @RequestBody HarvestDto dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
