package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.CustomerDao;
import com.farmmanagement.dto.CustomerDto;
import com.farmmanagement.model.Customer;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CustomerService {
    private final CustomerDao dao;
    public CustomerService(CustomerDao dao) { this.dao = dao; }
    public List<Customer> findAll() { return dao.findAll(); }
    public Customer findById(UUID id) { return dao.findById(id).orElseThrow(() -> new RuntimeException("Customer not found")); }
    public Customer create(CustomerDto dto) {
        Customer item = new Customer();
        item.setCustomerId(java.util.UUID.randomUUID());
        item.setFirstName(dto.getFirstName());
        item.setLastName(dto.getLastName());
        item.setPhoneNumber(dto.getPhoneNumber());
        item.setEmail(dto.getEmail());
        item.setAddress(dto.getAddress());
        return dao.save(item);
    }
    public Customer update(UUID id, CustomerDto dto) {
        Customer item = new Customer();
        item.setCustomerId(id);
        item.setFirstName(dto.getFirstName());
        item.setLastName(dto.getLastName());
        item.setPhoneNumber(dto.getPhoneNumber());
        item.setEmail(dto.getEmail());
        item.setAddress(dto.getAddress());
        if (!dao.update(id, item)) throw new RuntimeException("Customer not found");
        return findById(id);
    }
    public void delete(UUID id) { if (!dao.delete(id)) throw new RuntimeException("Customer not found"); }
}
