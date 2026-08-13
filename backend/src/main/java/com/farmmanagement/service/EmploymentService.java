package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.EmploymentDao;
import com.farmmanagement.dto.EmploymentDto;
import com.farmmanagement.model.Employment;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EmploymentService {
    private final EmploymentDao dao;
    public EmploymentService(EmploymentDao dao) { this.dao = dao; }
    public List<Employment> findAll() { return dao.findAll(); }
    public Employment findById(UUID id) { return dao.findById(id).orElseThrow(() -> new RuntimeException("Employment not found")); }
    public Employment create(EmploymentDto dto) {
        Employment item = new Employment();
        item.setEmploymentId(java.util.UUID.randomUUID());
        item.setUserId(dto.getUserId());
        item.setFarmId(dto.getFarmId());
        item.setRole(dto.getRole());
        item.setSalary(dto.getSalary());
        item.setHireDate(dto.getHireDate());
        item.setEmploymentStatus(dto.getEmploymentStatus());
        return dao.save(item);
    }
    public Employment update(UUID id, EmploymentDto dto) {
        Employment item = new Employment();
        item.setEmploymentId(id);
        item.setUserId(dto.getUserId());
        item.setFarmId(dto.getFarmId());
        item.setRole(dto.getRole());
        item.setSalary(dto.getSalary());
        item.setHireDate(dto.getHireDate());
        item.setEmploymentStatus(dto.getEmploymentStatus());
        if (!dao.update(id, item)) throw new RuntimeException("Employment not found");
        return findById(id);
    }
    public void delete(UUID id) { if (!dao.delete(id)) throw new RuntimeException("Employment not found"); }
}
