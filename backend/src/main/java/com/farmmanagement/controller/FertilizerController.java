package com.farmmanagement.controller;

import java.util.UUID;

import com.farmmanagement.dto.FertilizerDto;
import com.farmmanagement.model.Fertilizer;
import com.farmmanagement.service.FertilizerService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/fertilizer")
public class FertilizerController {
    private final FertilizerService service;

    public FertilizerController(FertilizerService service) { this.service = service; }

    @GetMapping
    public List<Fertilizer> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public Fertilizer findById(@PathVariable UUID id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Fertilizer create(@RequestBody FertilizerDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public Fertilizer update(@PathVariable UUID id, @RequestBody FertilizerDto dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
