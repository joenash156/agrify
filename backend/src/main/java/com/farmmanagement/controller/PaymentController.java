package com.farmmanagement.controller;

import java.util.UUID;

import com.farmmanagement.dto.PaymentDto;
import com.farmmanagement.model.Payment;
import com.farmmanagement.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/payment")
@PreAuthorize("hasAnyRole('ADMIN','FARM_MANAGER','SALES_PERSON')")
public class PaymentController {
    private final PaymentService service;

    public PaymentController(PaymentService service) { this.service = service; }

    @GetMapping
    public List<Payment> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public Payment findById(@PathVariable UUID id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Payment create(@RequestBody PaymentDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public Payment update(@PathVariable UUID id, @RequestBody PaymentDto dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
