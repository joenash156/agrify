package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.CustomerDao;
import com.farmmanagement.model.Customer;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcCustomerDao implements CustomerDao {
    private final JdbcTemplate jdbcTemplate;

    public JdbcCustomerDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Customer> findAll() {
        return jdbcTemplate.query("SELECT * FROM customer", BeanPropertyRowMapper.newInstance(Customer.class));
    }

    public Optional<Customer> findById(UUID id) {
        List<Customer> result = jdbcTemplate.query("SELECT * FROM customer WHERE customer_id = ?", BeanPropertyRowMapper.newInstance(Customer.class), id);
        return result.stream().findFirst();
    }

    public Customer save(Customer item) {
        jdbcTemplate.update("INSERT INTO customer (customer_id, first_name, last_name, phone_number, email, address) VALUES (?, ?, ?, ?, ?, ?)", item.getCustomerId(), item.getFirstName(), item.getLastName(), item.getPhoneNumber(), item.getEmail(), item.getAddress());
        return item;
    }

    public boolean update(UUID id, Customer item) {
        return jdbcTemplate.update("UPDATE customer SET first_name = ?, last_name = ?, phone_number = ?, email = ?, address = ? WHERE customer_id = ?", item.getFirstName(), item.getLastName(), item.getPhoneNumber(), item.getEmail(), item.getAddress(), id) > 0;
    }

    public boolean delete(UUID id) {
        return jdbcTemplate.update("DELETE FROM customer WHERE customer_id = ?", id) > 0;
    }
}
