package com.farmmanagement.dao;

import java.util.UUID;

import com.farmmanagement.model.Customer;
import java.util.List;
import java.util.Optional;

public interface CustomerDao {
    List<Customer> findAll();
    Optional<Customer> findById(UUID id);
    Customer save(Customer item);
    boolean update(UUID id, Customer item);
    boolean delete(UUID id);
}
