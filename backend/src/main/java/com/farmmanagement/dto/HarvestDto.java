package com.farmmanagement.dto;

import java.util.UUID;

import java.math.BigDecimal;
import java.time.LocalDate;

public class HarvestDto {
    private UUID cropId;
    private LocalDate harvestDate;
    private BigDecimal quantity;
    private String unit;
    private String qualityGrade;
    public HarvestDto() {}
    public UUID getCropId(){return cropId;} public void setCropId(UUID v){cropId=v;}
    public LocalDate getHarvestDate(){return harvestDate;} public void setHarvestDate(LocalDate v){harvestDate=v;}
    public BigDecimal getQuantity(){return quantity;} public void setQuantity(BigDecimal v){quantity=v;}
    public String getUnit(){return unit;} public void setUnit(String v){unit=v;}
    public String getQualityGrade(){return qualityGrade;} public void setQualityGrade(String v){qualityGrade=v;}
}
