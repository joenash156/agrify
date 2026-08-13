package com.farmmanagement.security;

import com.farmmanagement.dao.UserAccountDao;
import com.farmmanagement.model.UserAccount;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class DatabaseUserDetailsService implements UserDetailsService {
    private final UserAccountDao dao;
    public DatabaseUserDetailsService(UserAccountDao dao){this.dao=dao;}
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserAccount a=dao.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return User.withUsername(a.getUsername()).password(a.getPasswordHash()).authorities(new SimpleGrantedAuthority("ROLE_"+a.getRole())).disabled(!"ACTIVE".equals(a.getAccountStatus())).build();
    }
}
