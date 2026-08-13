package com.farmmanagement.controller;

import java.util.UUID;

import com.farmmanagement.dto.EquipmentDto;
import com.farmmanagement.model.Equipment;
import com.farmmanagement.service.EquipmentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {
    private final EquipmentService service;

    public EquipmentController(EquipmentService service) { this.service = service; }

    @GetMapping
    public List<Equipment> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public Equipment findById(@PathVariable UUID id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Equipment create(@RequestBody EquipmentDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public Equipment update(@PathVariable UUID id, @RequestBody EquipmentDto dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
