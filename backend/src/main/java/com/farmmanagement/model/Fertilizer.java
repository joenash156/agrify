package com.farmmanagement.model;

import java.util.UUID;

import java.math.BigDecimal;

public class Fertilizer {
    private UUID fertilizerId;
    private String fertilizerName;
    private String fertilizerType;
    private BigDecimal unitPrice;
    private BigDecimal quantity;

    public Fertilizer() {}

    public UUID getFertilizerId() { return fertilizerId; }
    public void setFertilizerId(UUID fertilizerId) { this.fertilizerId = fertilizerId; }
    public String getFertilizerName() { return fertilizerName; }
    public void setFertilizerName(String fertilizerName) { this.fertilizerName = fertilizerName; }
    public String getFertilizerType() { return fertilizerType; }
    public void setFertilizerType(String fertilizerType) { this.fertilizerType = fertilizerType; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
}
