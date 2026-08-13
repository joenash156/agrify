package com.farmmanagement.dto;

import java.math.BigDecimal;

public class FertilizerDto {
    private String fertilizerName;
    private String fertilizerType;
    private BigDecimal unitPrice;
    private BigDecimal quantity;

    public FertilizerDto() {}

    public String getFertilizerName() { return fertilizerName; }
    public void setFertilizerName(String fertilizerName) { this.fertilizerName = fertilizerName; }
    public String getFertilizerType() { return fertilizerType; }
    public void setFertilizerType(String fertilizerType) { this.fertilizerType = fertilizerType; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
}
