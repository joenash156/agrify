package com.farmmanagement.controller;

import java.util.UUID;

import com.farmmanagement.dto.EquipmentUsageDto;
import com.farmmanagement.model.EquipmentUsage;
import com.farmmanagement.service.EquipmentUsageService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/equipmentusage")
public class EquipmentUsageController {
    private final EquipmentUsageService service;

    public EquipmentUsageController(EquipmentUsageService service) { this.service = service; }

    @GetMapping
    public List<EquipmentUsage> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public EquipmentUsage findById(@PathVariable UUID id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EquipmentUsage create(@RequestBody EquipmentUsageDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public EquipmentUsage update(@PathVariable UUID id, @RequestBody EquipmentUsageDto dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
