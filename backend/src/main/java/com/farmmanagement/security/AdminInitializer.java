package com.farmmanagement.security;

import java.util.UUID;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {
    private final JdbcTemplate jdbcTemplate; private final PasswordEncoder passwordEncoder;
    public AdminInitializer(JdbcTemplate jdbcTemplate,PasswordEncoder passwordEncoder){this.jdbcTemplate=jdbcTemplate;this.passwordEncoder=passwordEncoder;}
    @Override public void run(String... args){
        Integer count=jdbcTemplate.queryForObject("SELECT COUNT(*) FROM user_account WHERE username='admin'",Integer.class);
        if(count!=null && count==0){
            UUID userId=java.util.UUID.randomUUID(); UUID accountId=java.util.UUID.randomUUID();
            jdbcTemplate.update("INSERT INTO app_user(user_id,first_name,last_name,email) VALUES(?,?,?,?)",userId,"System","Administrator","admin@farm.local");
            jdbcTemplate.update("INSERT INTO user_account(account_id,user_id,username,password_hash,account_status,role) VALUES(?,?,?,?,?,?)",accountId,userId,"admin",passwordEncoder.encode("admin123"),"ACTIVE","ADMIN");
        }
    }
}
