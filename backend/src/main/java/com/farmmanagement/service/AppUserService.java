package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.AppUserDao;
import com.farmmanagement.dao.UserAccountDao;
import com.farmmanagement.dto.AppUserDto;
import com.farmmanagement.model.AppUser;
import com.farmmanagement.model.UserAccount;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AppUserService {
    private final AppUserDao dao;
    private final UserAccountDao userAccountDao;
    public AppUserService(AppUserDao dao, UserAccountDao userAccountDao) {
        this.dao = dao;
        this.userAccountDao = userAccountDao;
    }
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
    /** Anyone may update their own profile; only ADMIN may update someone else's. */
    public AppUser update(UUID id, AppUserDto dto, String callerUsername) {
        UserAccount caller = userAccountDao.findByUsername(callerUsername)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        if (!"ADMIN".equals(caller.getRole()) && !caller.getUserId().equals(id)) {
            throw new AccessDeniedException("You can only update your own profile");
        }
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
