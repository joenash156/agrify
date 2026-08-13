package com.farmmanagement.controller;

import java.util.UUID;

import com.farmmanagement.dto.EquipmentMaintenanceDto;
import com.farmmanagement.model.EquipmentMaintenance;
import com.farmmanagement.service.EquipmentMaintenanceService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/equipmentmaintenance")
public class EquipmentMaintenanceController {
    private final EquipmentMaintenanceService service;

    public EquipmentMaintenanceController(EquipmentMaintenanceService service) { this.service = service; }

    @GetMapping
    public List<EquipmentMaintenance> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public EquipmentMaintenance findById(@PathVariable UUID id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EquipmentMaintenance create(@RequestBody EquipmentMaintenanceDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public EquipmentMaintenance update(@PathVariable UUID id, @RequestBody EquipmentMaintenanceDto dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
