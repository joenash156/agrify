package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.UserAccountDao;
import com.farmmanagement.dto.UserAccountDto;
import com.farmmanagement.model.UserAccount;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserAccountService {
    private final UserAccountDao dao;
    public UserAccountService(UserAccountDao dao) { this.dao = dao; }
    public List<UserAccount> findAll() { return dao.findAll(); }
    public UserAccount findById(UUID id) { return dao.findById(id).orElseThrow(() -> new RuntimeException("Account not found")); }
    public void update(UUID id, UserAccountDto dto) { dao.updateStatusAndRole(id, dto.getAccountStatus(), dto.getRole()); }
    public void delete(UUID id) { dao.delete(id); }
}
