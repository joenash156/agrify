package com.farmmanagement.dto;

import java.util.UUID;

import java.math.BigDecimal;
import java.time.LocalDate;

public class EquipmentDto {
    private UUID farmId;
    private String equipmentName;
    private String equipmentType;
    private LocalDate purchaseDate;
    private BigDecimal purchaseCost;
    private String equipmentStatus;

    public EquipmentDto() {}

    public UUID getFarmId() { return farmId; }
    public void setFarmId(UUID farmId) { this.farmId = farmId; }
    public String getEquipmentName() { return equipmentName; }
    public void setEquipmentName(String equipmentName) { this.equipmentName = equipmentName; }
    public String getEquipmentType() { return equipmentType; }
    public void setEquipmentType(String equipmentType) { this.equipmentType = equipmentType; }
    public LocalDate getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }
    public BigDecimal getPurchaseCost() { return purchaseCost; }
    public void setPurchaseCost(BigDecimal purchaseCost) { this.purchaseCost = purchaseCost; }
    public String getEquipmentStatus() { return equipmentStatus; }
    public void setEquipmentStatus(String equipmentStatus) { this.equipmentStatus = equipmentStatus; }
}
