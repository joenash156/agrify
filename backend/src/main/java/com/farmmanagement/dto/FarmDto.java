package com.farmmanagement.dto;

import java.math.BigDecimal;

public class FarmDto {
    private String farmName;
    private String location;
    private BigDecimal size;
    private String farmStatus;

    public FarmDto() {}

    public String getFarmName() { return farmName; }
    public void setFarmName(String farmName) { this.farmName = farmName; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public BigDecimal getSize() { return size; }
    public void setSize(BigDecimal size) { this.size = size; }
    public String getFarmStatus() { return farmStatus; }
    public void setFarmStatus(String farmStatus) { this.farmStatus = farmStatus; }
}
