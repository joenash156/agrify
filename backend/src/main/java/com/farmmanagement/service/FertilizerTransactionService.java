package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.FertilizerTransactionDao;
import com.farmmanagement.dto.FertilizerTransactionDto;
import com.farmmanagement.model.FertilizerTransaction;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FertilizerTransactionService {
    private final FertilizerTransactionDao dao;
    public FertilizerTransactionService(FertilizerTransactionDao dao) { this.dao = dao; }
    public List<FertilizerTransaction> findAll() { return dao.findAll(); }
    public FertilizerTransaction findById(UUID id) { return dao.findById(id).orElseThrow(() -> new RuntimeException("FertilizerTransaction not found")); }
    public FertilizerTransaction create(FertilizerTransactionDto dto) {
        FertilizerTransaction item = new FertilizerTransaction();
        item.setTransactionId(java.util.UUID.randomUUID());
        item.setFertilizerId(dto.getFertilizerId());
        item.setTransactionType(dto.getTransactionType());
        item.setQuantity(dto.getQuantity());
        item.setUnitPrice(dto.getUnitPrice());
        return dao.save(item);
    }
    public FertilizerTransaction update(UUID id, FertilizerTransactionDto dto) {
        FertilizerTransaction item = new FertilizerTransaction();
        item.setTransactionId(id);
        item.setFertilizerId(dto.getFertilizerId());
        item.setTransactionType(dto.getTransactionType());
        item.setQuantity(dto.getQuantity());
        item.setUnitPrice(dto.getUnitPrice());
        if (!dao.update(id, item)) throw new RuntimeException("FertilizerTransaction not found");
        return findById(id);
    }
    public void delete(UUID id) { if (!dao.delete(id)) throw new RuntimeException("FertilizerTransaction not found"); }
}
