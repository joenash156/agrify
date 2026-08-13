package com.farmmanagement.dto;

import java.util.UUID;

import java.math.BigDecimal;
import java.time.LocalDate;

public class EquipmentMaintenanceDto {
    private UUID equipmentId;
    private LocalDate maintenanceDate;
    private String maintenanceType;
    private BigDecimal cost;
    private String description;

    public EquipmentMaintenanceDto() {}

    public UUID getEquipmentId() { return equipmentId; }
    public void setEquipmentId(UUID equipmentId) { this.equipmentId = equipmentId; }
    public LocalDate getMaintenanceDate() { return maintenanceDate; }
    public void setMaintenanceDate(LocalDate maintenanceDate) { this.maintenanceDate = maintenanceDate; }
    public String getMaintenanceType() { return maintenanceType; }
    public void setMaintenanceType(String maintenanceType) { this.maintenanceType = maintenanceType; }
    public BigDecimal getCost() { return cost; }
    public void setCost(BigDecimal cost) { this.cost = cost; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
