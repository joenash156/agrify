package com.farmmanagement.model;

import java.util.UUID;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Farm {
    private UUID farmId;
    private String farmName;
    private String location;
    private BigDecimal size;
    private String farmStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Farm() {}

    public UUID getFarmId() { return farmId; }
    public void setFarmId(UUID farmId) { this.farmId = farmId; }
    public String getFarmName() { return farmName; }
    public void setFarmName(String farmName) { this.farmName = farmName; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public BigDecimal getSize() { return size; }
    public void setSize(BigDecimal size) { this.size = size; }
    public String getFarmStatus() { return farmStatus; }
    public void setFarmStatus(String farmStatus) { this.farmStatus = farmStatus; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
