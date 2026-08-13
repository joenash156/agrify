package com.farmmanagement.dto;

import java.util.UUID;

import java.math.BigDecimal;

public class FertilizerTransactionDto {
    private UUID fertilizerId;
    private String transactionType;
    private BigDecimal quantity;
    private BigDecimal unitPrice;

    public FertilizerTransactionDto() {}

    public UUID getFertilizerId() { return fertilizerId; }
    public void setFertilizerId(UUID fertilizerId) { this.fertilizerId = fertilizerId; }
    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
}
