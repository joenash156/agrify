package com.farmmanagement.controller;

import java.util.UUID;

import com.farmmanagement.dto.CropDiseaseDto;
import com.farmmanagement.model.CropDisease;
import com.farmmanagement.service.CropDiseaseService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/crop-diseases")
public class CropDiseaseController {
    private final CropDiseaseService service;
    public CropDiseaseController(CropDiseaseService service){this.service=service;}
    @GetMapping public List<CropDisease> findAll(){return service.findAll();}
    @GetMapping("/crop/{cropId}") public List<CropDisease> findByCrop(@PathVariable UUID cropId){return service.findByCrop(cropId);}
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public CropDisease create(@RequestBody CropDiseaseDto dto){return service.create(dto);}
    @DeleteMapping("/{cropId}/{diseaseId}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable UUID cropId,@PathVariable UUID diseaseId){service.delete(cropId,diseaseId);}
}
