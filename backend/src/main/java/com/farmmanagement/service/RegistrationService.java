package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.AppUserDao;
import com.farmmanagement.dao.UserAccountDao;
import com.farmmanagement.dto.RegisterDto;
import com.farmmanagement.model.AppUser;
import com.farmmanagement.model.UserAccount;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegistrationService {
    private final AppUserDao appUserDao;
    private final UserAccountDao userAccountDao;
    private final PasswordEncoder passwordEncoder;
    public RegistrationService(AppUserDao appUserDao,UserAccountDao userAccountDao,PasswordEncoder passwordEncoder){this.appUserDao=appUserDao;this.userAccountDao=userAccountDao;this.passwordEncoder=passwordEncoder;}
    @Transactional
    public void register(RegisterDto dto){
        AppUser user=new AppUser();
        user.setUserId(java.util.UUID.randomUUID());
        user.setFirstName(dto.getFirstName()); user.setLastName(dto.getLastName()); user.setEmail(dto.getEmail()); user.setPhoneNumber(dto.getPhoneNumber());
        appUserDao.save(user);
        UserAccount account=new UserAccount();
        account.setAccountId(java.util.UUID.randomUUID()); account.setUserId(user.getUserId()); account.setUsername(dto.getUsername());
        account.setPasswordHash(passwordEncoder.encode(dto.getPassword())); account.setAccountStatus("ACTIVE"); account.setRole("USER");
        userAccountDao.create(account);
    }
}
