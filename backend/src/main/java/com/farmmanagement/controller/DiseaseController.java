package com.farmmanagement.controller;

import java.util.UUID;

import com.farmmanagement.dto.DiseaseDto;
import com.farmmanagement.model.Disease;
import com.farmmanagement.service.DiseaseService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/disease")
public class DiseaseController {
    private final DiseaseService service;

    public DiseaseController(DiseaseService service) { this.service = service; }

    @GetMapping
    public List<Disease> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public Disease findById(@PathVariable UUID id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Disease create(@RequestBody DiseaseDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public Disease update(@PathVariable UUID id, @RequestBody DiseaseDto dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
