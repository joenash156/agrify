package com.farmmanagement.model;

import java.util.UUID;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Harvest {
    private UUID harvestId;
    private UUID cropId;
    private LocalDate harvestDate;
    private BigDecimal quantity;
    private String unit;
    private String qualityGrade;

    public Harvest() {}

    public UUID getHarvestId() { return harvestId; }
    public void setHarvestId(UUID harvestId) { this.harvestId = harvestId; }
    public UUID getCropId() { return cropId; }
    public void setCropId(UUID cropId) { this.cropId = cropId; }
    public LocalDate getHarvestDate() { return harvestDate; }
    public void setHarvestDate(LocalDate harvestDate) { this.harvestDate = harvestDate; }
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public String getQualityGrade() { return qualityGrade; }
    public void setQualityGrade(String qualityGrade) { this.qualityGrade = qualityGrade; }
}
