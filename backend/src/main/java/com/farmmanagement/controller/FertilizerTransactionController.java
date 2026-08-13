package com.farmmanagement.controller;

import java.util.UUID;

import com.farmmanagement.dto.FertilizerTransactionDto;
import com.farmmanagement.model.FertilizerTransaction;
import com.farmmanagement.service.FertilizerTransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/fertilizertransaction")
public class FertilizerTransactionController {
    private final FertilizerTransactionService service;

    public FertilizerTransactionController(FertilizerTransactionService service) { this.service = service; }

    @GetMapping
    public List<FertilizerTransaction> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public FertilizerTransaction findById(@PathVariable UUID id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FertilizerTransaction create(@RequestBody FertilizerTransactionDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public FertilizerTransaction update(@PathVariable UUID id, @RequestBody FertilizerTransactionDto dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
