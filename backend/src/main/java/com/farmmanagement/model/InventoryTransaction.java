package com.farmmanagement.model;

import java.util.UUID;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class InventoryTransaction {
    private UUID transactionId;
    private UUID inventoryId;
    private String transactionType;
    private BigDecimal quantity;
    private LocalDateTime transactionDate;

    public InventoryTransaction() {}

    public UUID getTransactionId() { return transactionId; }
    public void setTransactionId(UUID transactionId) { this.transactionId = transactionId; }
    public UUID getInventoryId() { return inventoryId; }
    public void setInventoryId(UUID inventoryId) { this.inventoryId = inventoryId; }
    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }
}
