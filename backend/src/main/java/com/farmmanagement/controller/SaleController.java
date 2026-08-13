package com.farmmanagement.controller;

import java.util.UUID;

import com.farmmanagement.dto.SaleDto;
import com.farmmanagement.dto.SaleSummaryDto;
import com.farmmanagement.model.Sale;
import com.farmmanagement.service.SaleService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sale")
public class SaleController {
    private final SaleService service;

    public SaleController(SaleService service) { this.service = service; }

    @GetMapping
    public List<Sale> findAll() { return service.findAll(); }

    @GetMapping("/summary")
    public List<SaleSummaryDto> findAllWithDetails() { return service.findAllWithDetails(); }

    @GetMapping("/{id}")
    public Sale findById(@PathVariable UUID id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Sale create(@RequestBody SaleDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public Sale update(@PathVariable UUID id, @RequestBody SaleDto dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
