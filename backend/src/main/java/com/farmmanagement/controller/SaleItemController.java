package com.farmmanagement.controller;

import java.util.UUID;

import com.farmmanagement.dto.SaleItemDto;
import com.farmmanagement.model.SaleItem;
import com.farmmanagement.service.SaleItemService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sale-items")
public class SaleItemController {
    private final SaleItemService service;
    public SaleItemController(SaleItemService service){this.service=service;}
    @GetMapping public List<SaleItem> findAll(){return service.findAll();}
    @GetMapping("/sale/{saleId}") public List<SaleItem> findBySale(@PathVariable UUID saleId){return service.findBySale(saleId);}
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public void create(@RequestBody SaleItemDto dto){service.create(dto);}
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable UUID id){service.delete(id);}
}
