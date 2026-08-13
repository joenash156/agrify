package com.farmmanagement.controller;

import java.util.UUID;

import com.farmmanagement.dto.CropDto;
import com.farmmanagement.model.Crop;
import com.farmmanagement.service.CropService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/crop")
public class CropController {
    private final CropService service;

    public CropController(CropService service) { this.service = service; }

    @GetMapping
    public List<Crop> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public Crop findById(@PathVariable UUID id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Crop create(@RequestBody CropDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public Crop update(@PathVariable UUID id, @RequestBody CropDto dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
