package com.farmmanagement.dao;

import java.util.UUID;

import com.farmmanagement.model.Payment;
import java.util.List;
import java.util.Optional;

public interface PaymentDao {
    List<Payment> findAll();
    Optional<Payment> findById(UUID id);
    Payment save(Payment item);
    boolean update(UUID id, Payment item);
    boolean delete(UUID id);
}
