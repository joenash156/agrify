package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.AppUserDao;
import com.farmmanagement.dto.AppUserDto;
import com.farmmanagement.model.AppUser;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AppUserService {
    private final AppUserDao dao;
    public AppUserService(AppUserDao dao) { this.dao = dao; }
    public List<AppUser> findAll() { return dao.findAll(); }
    public AppUser findById(UUID id) { return dao.findById(id).orElseThrow(() -> new RuntimeException("AppUser not found")); }
    public AppUser create(AppUserDto dto) {
        AppUser item = new AppUser();
        item.setUserId(java.util.UUID.randomUUID());
        item.setFirstName(dto.getFirstName());
        item.setLastName(dto.getLastName());
        item.setEmail(dto.getEmail());
        item.setPhoneNumber(dto.getPhoneNumber());
        item.setOtherPhoneNumber(dto.getOtherPhoneNumber());
        return dao.save(item);
    }
    public AppUser update(UUID id, AppUserDto dto) {
        AppUser item = new AppUser();
        item.setUserId(id);
        item.setFirstName(dto.getFirstName());
        item.setLastName(dto.getLastName());
        item.setEmail(dto.getEmail());
        item.setPhoneNumber(dto.getPhoneNumber());
        item.setOtherPhoneNumber(dto.getOtherPhoneNumber());
        if (!dao.update(id, item)) throw new RuntimeException("AppUser not found");
        return findById(id);
    }
    public void delete(UUID id) { if (!dao.delete(id)) throw new RuntimeException("AppUser not found"); }
}
