package com.farmmanagement.model;

import java.util.UUID;

import java.math.BigDecimal;
import java.time.LocalDate;

public class EquipmentMaintenance {
    private UUID maintenanceId;
    private UUID equipmentId;
    private LocalDate maintenanceDate;
    private String maintenanceType;
    private BigDecimal cost;
    private String description;

    public EquipmentMaintenance() {}

    public UUID getMaintenanceId() { return maintenanceId; }
    public void setMaintenanceId(UUID maintenanceId) { this.maintenanceId = maintenanceId; }
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
