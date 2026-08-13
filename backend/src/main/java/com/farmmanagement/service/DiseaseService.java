package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.DiseaseDao;
import com.farmmanagement.dto.DiseaseDto;
import com.farmmanagement.model.Disease;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DiseaseService {
    private final DiseaseDao dao;
    public DiseaseService(DiseaseDao dao) { this.dao = dao; }
    public List<Disease> findAll() { return dao.findAll(); }
    public Disease findById(UUID id) { return dao.findById(id).orElseThrow(() -> new RuntimeException("Disease not found")); }
    public Disease create(DiseaseDto dto) {
        Disease item = new Disease();
        item.setDiseaseId(java.util.UUID.randomUUID());
        item.setDiseaseName(dto.getDiseaseName());
        item.setDescription(dto.getDescription());
        return dao.save(item);
    }
    public Disease update(UUID id, DiseaseDto dto) {
        Disease item = new Disease();
        item.setDiseaseId(id);
        item.setDiseaseName(dto.getDiseaseName());
        item.setDescription(dto.getDescription());
        if (!dao.update(id, item)) throw new RuntimeException("Disease not found");
        return findById(id);
    }
    public void delete(UUID id) { if (!dao.delete(id)) throw new RuntimeException("Disease not found"); }
}
