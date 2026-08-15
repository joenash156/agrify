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
        String userId;
        if(count!=null && count==0){
            userId=java.util.UUID.randomUUID().toString(); String accountId=java.util.UUID.randomUUID().toString();
            jdbcTemplate.update("INSERT INTO app_user(user_id,first_name,last_name,email) VALUES(?,?,?,?)",userId,"System","Administrator","admin@farm.local");
            jdbcTemplate.update("INSERT INTO user_account(account_id,user_id,username,password_hash,account_status,role) VALUES(?,?,?,?,?,?)",accountId,userId,"admin",passwordEncoder.encode("admin123"),"ACTIVE","ADMIN");
        } else {
            userId=jdbcTemplate.queryForObject("SELECT user_id FROM user_account WHERE username='admin'",String.class);
        }

        // The demo accounts (DemoAccountInitializer) get seeded notifications straight from
        // database/db/insert_data.sql, but admin's userId is only known at runtime — so it needs its
        // own welcome notifications here. Checked independently of account creation (not just
        // "if just created") so an admin account from an older run without any notifications
        // still gets seeded on the next restart instead of staying empty forever.
        Integer notificationCount=jdbcTemplate.queryForObject("SELECT COUNT(*) FROM notification WHERE user_id=?",Integer.class,userId);
        if(notificationCount!=null && notificationCount==0){
            jdbcTemplate.update(
                    "INSERT INTO notification(notification_id,user_id,category,title,message,is_read,created_at) VALUES(?,?,?,?,?,?,NOW())",
                    UUID.randomUUID().toString(), userId, "SYSTEM", "Welcome to Agrify",
                    "Your admin account is set up. Review pending staff activations under Employees.", false);
            jdbcTemplate.update(
                    "INSERT INTO notification(notification_id,user_id,category,title,message,is_read,created_at) VALUES(?,?,?,?,?,?,NOW())",
                    UUID.randomUUID().toString(), userId, "SYSTEM", "Weekly summary ready",
                    "Your farm performance summary for last week is ready to view.", true);
        }
    }
}
