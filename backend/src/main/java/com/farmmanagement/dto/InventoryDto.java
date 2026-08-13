package com.farmmanagement.dto;

import java.util.UUID;

import java.math.BigDecimal;

public class InventoryDto {
    private UUID harvestId;
    private String itemName;
    private BigDecimal quantity;
    private String unit;
    private String storageLocation;

    public InventoryDto() {}

    public UUID getHarvestId() { return harvestId; }
    public void setHarvestId(UUID harvestId) { this.harvestId = harvestId; }
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public String getStorageLocation() { return storageLocation; }
    public void setStorageLocation(String storageLocation) { this.storageLocation = storageLocation; }
}
