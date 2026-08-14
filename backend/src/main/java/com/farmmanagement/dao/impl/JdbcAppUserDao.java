package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.AppUserDao;
import com.farmmanagement.model.AppUser;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcAppUserDao implements AppUserDao {
    private final JdbcTemplate jdbcTemplate;

    public JdbcAppUserDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Every consumer of this list (staff pickers on Attendance/POS/Sales, the Employees table)
    // wants regular staff, never the system admin — ADMIN never has an employment record, so
    // including it would only ever show up as a permanently-unplaceable phantom row.
    public List<AppUser> findAll() {
        return jdbcTemplate.query(
                "SELECT u.* FROM app_user u " +
                        "WHERE NOT EXISTS (SELECT 1 FROM user_account a WHERE a.user_id = u.user_id AND a.role = 'ADMIN')",
                BeanPropertyRowMapper.newInstance(AppUser.class));
    }

    public Optional<AppUser> findById(UUID id) {
        List<AppUser> result = jdbcTemplate.query("SELECT * FROM app_user WHERE user_id = ?", BeanPropertyRowMapper.newInstance(AppUser.class), id);
        return result.stream().findFirst();
    }

    public AppUser save(AppUser item) {
        jdbcTemplate.update("INSERT INTO app_user (user_id, first_name, last_name, email, phone_number, other_phone_number) VALUES (?, ?, ?, ?, ?, ?)", item.getUserId(), item.getFirstName(), item.getLastName(), item.getEmail(), item.getPhoneNumber(), item.getOtherPhoneNumber());
        return item;
    }

    public boolean update(UUID id, AppUser item) {
        return jdbcTemplate.update("UPDATE app_user SET first_name = ?, last_name = ?, email = ?, phone_number = ?, other_phone_number = ? WHERE user_id = ?", item.getFirstName(), item.getLastName(), item.getEmail(), item.getPhoneNumber(), item.getOtherPhoneNumber(), id) > 0;
    }

    public boolean delete(UUID id) {
        return jdbcTemplate.update("DELETE FROM app_user WHERE user_id = ?", id) > 0;
    }

    public void updateWorkingStatus(UUID userId, String workingStatus) {
        jdbcTemplate.update("UPDATE app_user SET working_status = ? WHERE user_id = ?", workingStatus, userId);
    }
}
