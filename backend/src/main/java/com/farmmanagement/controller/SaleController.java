package com.farmmanagement.controller;

import java.util.UUID;

import com.farmmanagement.dto.SaleDto;
import com.farmmanagement.dto.SaleSummaryDto;
import com.farmmanagement.dto.VoidSaleDto;
import com.farmmanagement.model.Sale;
import com.farmmanagement.service.SaleService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sale")
@PreAuthorize("hasAnyRole('ADMIN','FARM_MANAGER','SALES_PERSON')")
public class SaleController {
    private final SaleService service;

    public SaleController(SaleService service) { this.service = service; }

    @GetMapping
    public List<Sale> findAll() { return service.findAll(); }

    @GetMapping("/summary")
    public List<SaleSummaryDto> findAllWithDetails(Authentication authentication) {
        return service.findAllWithDetails(authentication.getName());
    }

    @GetMapping("/{id}")
    public Sale findById(@PathVariable UUID id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Sale create(@RequestBody SaleDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public Sale update(@PathVariable UUID id, @RequestBody SaleDto dto) { return service.update(id, dto); }

    @PutMapping("/{id}/void")
    public void voidSale(@PathVariable UUID id, @RequestBody VoidSaleDto dto, Authentication authentication) {
        service.voidSale(id, dto.getReason(), authentication.getName());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
