package com.farmmanagement.dto;

import java.util.UUID;

import java.time.LocalDate;

public class CropDto {
    private UUID farmId;
    private String cropName;
    private String cropVariety;
    private LocalDate plantingDate;
    private LocalDate expectedHarvestDate;
    private String cropStatus;

    public CropDto() {}

    public UUID getFarmId() { return farmId; }
    public void setFarmId(UUID farmId) { this.farmId = farmId; }
    public String getCropName() { return cropName; }
    public void setCropName(String cropName) { this.cropName = cropName; }
    public String getCropVariety() { return cropVariety; }
    public void setCropVariety(String cropVariety) { this.cropVariety = cropVariety; }
    public LocalDate getPlantingDate() { return plantingDate; }
    public void setPlantingDate(LocalDate plantingDate) { this.plantingDate = plantingDate; }
    public LocalDate getExpectedHarvestDate() { return expectedHarvestDate; }
    public void setExpectedHarvestDate(LocalDate expectedHarvestDate) { this.expectedHarvestDate = expectedHarvestDate; }
    public String getCropStatus() { return cropStatus; }
    public void setCropStatus(String cropStatus) { this.cropStatus = cropStatus; }
}
