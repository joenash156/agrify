package com.farmmanagement.model;

import java.util.UUID;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class FertilizerTransaction {
    private UUID transactionId;
    private UUID fertilizerId;
    private String transactionType;
    private BigDecimal quantity;
    private BigDecimal unitPrice;
    private LocalDateTime transactionDate;

    public FertilizerTransaction() {}

    public UUID getTransactionId() { return transactionId; }
    public void setTransactionId(UUID transactionId) { this.transactionId = transactionId; }
    public UUID getFertilizerId() { return fertilizerId; }
    public void setFertilizerId(UUID fertilizerId) { this.fertilizerId = fertilizerId; }
    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }
}
