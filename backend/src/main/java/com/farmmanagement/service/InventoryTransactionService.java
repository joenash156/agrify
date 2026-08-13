package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.InventoryTransactionDao;
import com.farmmanagement.dto.InventoryTransactionDto;
import com.farmmanagement.model.InventoryTransaction;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class InventoryTransactionService {
    private final InventoryTransactionDao dao;
    public InventoryTransactionService(InventoryTransactionDao dao) { this.dao = dao; }
    public List<InventoryTransaction> findAll() { return dao.findAll(); }
    public InventoryTransaction findById(UUID id) { return dao.findById(id).orElseThrow(() -> new RuntimeException("InventoryTransaction not found")); }
    public InventoryTransaction create(InventoryTransactionDto dto) {
        InventoryTransaction item = new InventoryTransaction();
        item.setTransactionId(java.util.UUID.randomUUID());
        item.setInventoryId(dto.getInventoryId());
        item.setTransactionType(dto.getTransactionType());
        item.setQuantity(dto.getQuantity());
        return dao.save(item);
    }
    public InventoryTransaction update(UUID id, InventoryTransactionDto dto) {
        InventoryTransaction item = new InventoryTransaction();
        item.setTransactionId(id);
        item.setInventoryId(dto.getInventoryId());
        item.setTransactionType(dto.getTransactionType());
        item.setQuantity(dto.getQuantity());
        if (!dao.update(id, item)) throw new RuntimeException("InventoryTransaction not found");
        return findById(id);
    }
    public void delete(UUID id) { if (!dao.delete(id)) throw new RuntimeException("InventoryTransaction not found"); }
}
