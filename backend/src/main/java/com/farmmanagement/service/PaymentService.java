package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.PaymentDao;
import com.farmmanagement.dto.PaymentDto;
import com.farmmanagement.model.Payment;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PaymentService {
    private final PaymentDao dao;
    public PaymentService(PaymentDao dao) { this.dao = dao; }
    public List<Payment> findAll() { return dao.findAll(); }
    public Payment findById(UUID id) { return dao.findById(id).orElseThrow(() -> new RuntimeException("Payment not found")); }
    public Payment create(PaymentDto dto) {
        Payment item = new Payment();
        item.setPaymentId(java.util.UUID.randomUUID());
        item.setSaleId(dto.getSaleId());
        item.setAmount(dto.getAmount());
        item.setPaymentMethod(dto.getPaymentMethod());
        item.setPaymentStatus(dto.getPaymentStatus());
        return dao.save(item);
    }
    public Payment update(UUID id, PaymentDto dto) {
        Payment item = new Payment();
        item.setPaymentId(id);
        item.setSaleId(dto.getSaleId());
        item.setAmount(dto.getAmount());
        item.setPaymentMethod(dto.getPaymentMethod());
        item.setPaymentStatus(dto.getPaymentStatus());
        if (!dao.update(id, item)) throw new RuntimeException("Payment not found");
        return findById(id);
    }
    public void delete(UUID id) { if (!dao.delete(id)) throw new RuntimeException("Payment not found"); }
}
