package com.farmmanagement.controller;

import java.util.UUID;

import com.farmmanagement.dto.FertilizerApplicationDto;
import com.farmmanagement.model.FertilizerApplication;
import com.farmmanagement.service.FertilizerApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/fertilizerapplication")
public class FertilizerApplicationController {
    private final FertilizerApplicationService service;

    public FertilizerApplicationController(FertilizerApplicationService service) { this.service = service; }

    @GetMapping
    public List<FertilizerApplication> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public FertilizerApplication findById(@PathVariable UUID id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FertilizerApplication create(@RequestBody FertilizerApplicationDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public FertilizerApplication update(@PathVariable UUID id, @RequestBody FertilizerApplicationDto dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
