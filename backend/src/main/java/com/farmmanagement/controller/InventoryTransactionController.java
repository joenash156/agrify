package com.farmmanagement.controller;

import java.util.UUID;

import com.farmmanagement.dto.InventoryTransactionDto;
import com.farmmanagement.model.InventoryTransaction;
import com.farmmanagement.service.InventoryTransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventorytransaction")
public class InventoryTransactionController {
    private final InventoryTransactionService service;

    public InventoryTransactionController(InventoryTransactionService service) { this.service = service; }

    @GetMapping
    public List<InventoryTransaction> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public InventoryTransaction findById(@PathVariable UUID id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InventoryTransaction create(@RequestBody InventoryTransactionDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public InventoryTransaction update(@PathVariable UUID id, @RequestBody InventoryTransactionDto dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
