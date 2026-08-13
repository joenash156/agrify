package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.InventoryDao;
import com.farmmanagement.dto.InventoryDto;
import com.farmmanagement.model.Inventory;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class InventoryService {
    private final InventoryDao dao;
    public InventoryService(InventoryDao dao) { this.dao = dao; }
    public List<Inventory> findAll() { return dao.findAll(); }
    public Inventory findById(UUID id) { return dao.findById(id).orElseThrow(() -> new RuntimeException("Inventory not found")); }
    public Inventory create(InventoryDto dto) {
        Inventory item = new Inventory();
        item.setInventoryId(java.util.UUID.randomUUID());
        item.setFarmId(dto.getFarmId());
        item.setItemName(dto.getItemName());
        item.setQuantity(dto.getQuantity());
        item.setUnitPrice(dto.getUnitPrice());
        return dao.save(item);
    }
    public Inventory update(UUID id, InventoryDto dto) {
        Inventory item = new Inventory();
        item.setInventoryId(id);
        item.setFarmId(dto.getFarmId());
        item.setItemName(dto.getItemName());
        item.setQuantity(dto.getQuantity());
        item.setUnitPrice(dto.getUnitPrice());
        if (!dao.update(id, item)) throw new RuntimeException("Inventory not found");
        return findById(id);
    }
    public void delete(UUID id) { if (!dao.delete(id)) throw new RuntimeException("Inventory not found"); }
}
