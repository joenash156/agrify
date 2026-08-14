package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.AppUserDao;
import com.farmmanagement.dao.EmploymentDao;
import com.farmmanagement.dto.EmploymentDto;
import com.farmmanagement.model.Employment;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EmploymentService {
    private final EmploymentDao dao;
    private final AppUserDao appUserDao;
    public EmploymentService(EmploymentDao dao, AppUserDao appUserDao) { this.dao = dao; this.appUserDao = appUserDao; }
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
        Employment saved = dao.save(item);
        appUserDao.updateWorkingStatus(saved.getUserId(), saved.getEmploymentStatus());
        return saved;
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
        appUserDao.updateWorkingStatus(item.getUserId(), item.getEmploymentStatus());
        return findById(id);
    }
    public void delete(UUID id) {
        Employment existing = findById(id);
        if (!dao.delete(id)) throw new RuntimeException("Employment not found");
        appUserDao.updateWorkingStatus(existing.getUserId(), null);
    }
}
