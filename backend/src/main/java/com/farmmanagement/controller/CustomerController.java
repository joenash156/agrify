package com.farmmanagement.controller;

import java.util.UUID;

import com.farmmanagement.dto.CustomerDto;
import com.farmmanagement.model.Customer;
import com.farmmanagement.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {
    private final CustomerService service;

    public CustomerController(CustomerService service) { this.service = service; }

    @GetMapping
    public List<Customer> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public Customer findById(@PathVariable UUID id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Customer create(@RequestBody CustomerDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public Customer update(@PathVariable UUID id, @RequestBody CustomerDto dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
