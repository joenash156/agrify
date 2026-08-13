package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.UserAccountDao;
import com.farmmanagement.model.UserAccount;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcUserAccountDao implements UserAccountDao {
    private final JdbcTemplate jdbcTemplate;
    public JdbcUserAccountDao(JdbcTemplate jdbcTemplate) { this.jdbcTemplate = jdbcTemplate; }
    public Optional<UserAccount> findByUsername(String username) {
        return jdbcTemplate.query("SELECT * FROM user_account WHERE username = ?", BeanPropertyRowMapper.newInstance(UserAccount.class), username).stream().findFirst();
    }
    public Optional<UserAccount> findById(UUID id) {
        return jdbcTemplate.query("SELECT * FROM user_account WHERE account_id = ?", BeanPropertyRowMapper.newInstance(UserAccount.class), id).stream().findFirst();
    }
    public List<UserAccount> findAll() { return jdbcTemplate.query("SELECT * FROM user_account", BeanPropertyRowMapper.newInstance(UserAccount.class)); }
    public void create(UserAccount account) {
        jdbcTemplate.update("INSERT INTO user_account (account_id,user_id,username,password_hash,account_status,role) VALUES (?,?,?,?,?,?)",
                account.getAccountId(), account.getUserId(), account.getUsername(), account.getPasswordHash(), account.getAccountStatus(), account.getRole());
    }
    public void updateStatusAndRole(UUID id, String status, String role) {
        jdbcTemplate.update("UPDATE user_account SET account_status=?, role=? WHERE account_id=?", status, role, id);
    }
    public void delete(UUID id) { jdbcTemplate.update("DELETE FROM user_account WHERE account_id=?", id); }
}
