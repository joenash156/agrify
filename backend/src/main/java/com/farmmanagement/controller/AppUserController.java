package com.farmmanagement.controller;

import java.util.UUID;

import com.farmmanagement.dto.AppUserDto;
import com.farmmanagement.model.AppUser;
import com.farmmanagement.service.AppUserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/appuser")
public class AppUserController {
    private final AppUserService service;

    public AppUserController(AppUserService service) { this.service = service; }

    @GetMapping
    public List<AppUser> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public AppUser findById(@PathVariable UUID id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AppUser create(@RequestBody AppUserDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public AppUser update(@PathVariable UUID id, @RequestBody AppUserDto dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
