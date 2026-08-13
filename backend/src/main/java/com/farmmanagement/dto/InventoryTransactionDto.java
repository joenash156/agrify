package com.farmmanagement.dto;

import java.util.UUID;

import java.math.BigDecimal;

public class InventoryTransactionDto {
    private UUID inventoryId;
    private String transactionType;
    private BigDecimal quantity;

    public InventoryTransactionDto() {}

    public UUID getInventoryId() { return inventoryId; }
    public void setInventoryId(UUID inventoryId) { this.inventoryId = inventoryId; }
    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
}
