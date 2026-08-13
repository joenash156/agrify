package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.EmploymentDao;
import com.farmmanagement.model.Employment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcEmploymentDao implements EmploymentDao {
    private final JdbcTemplate jdbcTemplate;

    public JdbcEmploymentDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Employment> findAll() {
        return jdbcTemplate.query("SELECT * FROM employment", BeanPropertyRowMapper.newInstance(Employment.class));
    }

    public Optional<Employment> findById(UUID id) {
        List<Employment> result = jdbcTemplate.query("SELECT * FROM employment WHERE employment_id = ?", BeanPropertyRowMapper.newInstance(Employment.class), id);
        return result.stream().findFirst();
    }

    public Employment save(Employment item) {
        jdbcTemplate.update("INSERT INTO employment (employment_id, user_id, farm_id, role, salary, hire_date, employment_status) VALUES (?, ?, ?, ?, ?, ?, ?)", item.getEmploymentId(), item.getUserId(), item.getFarmId(), item.getRole(), item.getSalary(), item.getHireDate(), item.getEmploymentStatus());
        return item;
    }

    public boolean update(UUID id, Employment item) {
        return jdbcTemplate.update("UPDATE employment SET user_id = ?, farm_id = ?, role = ?, salary = ?, hire_date = ?, employment_status = ? WHERE employment_id = ?", item.getUserId(), item.getFarmId(), item.getRole(), item.getSalary(), item.getHireDate(), item.getEmploymentStatus(), id) > 0;
    }

    public boolean delete(UUID id) {
        return jdbcTemplate.update("DELETE FROM employment WHERE employment_id = ?", id) > 0;
    }
}
