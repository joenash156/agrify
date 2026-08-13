package com.farmmanagement.dao;

import java.util.UUID;

import com.farmmanagement.model.SaleItem;
import java.util.List;

public interface SaleItemDao {
    List<SaleItem> findAll();
    List<SaleItem> findBySale(UUID saleId);
    void recordSaleItem(UUID saleId, UUID inventoryId, java.math.BigDecimal quantity, java.math.BigDecimal unitPrice);
    void delete(UUID id);
}
