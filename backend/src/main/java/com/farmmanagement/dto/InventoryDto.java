package com.farmmanagement.dto;

import java.util.UUID;

import java.math.BigDecimal;

public class InventoryDto {
    private UUID farmId;
    private String itemName;
    private BigDecimal quantity;
    private BigDecimal unitPrice;

    public InventoryDto() {}

    public UUID getFarmId() { return farmId; }
    public void setFarmId(UUID farmId) { this.farmId = farmId; }
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
}
