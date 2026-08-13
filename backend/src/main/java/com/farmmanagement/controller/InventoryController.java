package com.farmmanagement.controller;

import java.util.UUID;

import com.farmmanagement.dto.InventoryDto;
import com.farmmanagement.model.Inventory;
import com.farmmanagement.service.InventoryService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    private final InventoryService service;

    public InventoryController(InventoryService service) { this.service = service; }

    @GetMapping
    public List<Inventory> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public Inventory findById(@PathVariable UUID id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Inventory create(@RequestBody InventoryDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public Inventory update(@PathVariable UUID id, @RequestBody InventoryDto dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
