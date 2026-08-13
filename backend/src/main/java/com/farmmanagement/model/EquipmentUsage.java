package com.farmmanagement.model;

import java.util.UUID;

import java.math.BigDecimal;
import java.time.LocalDate;

public class EquipmentUsage {
    private UUID usageId;
    private UUID equipmentId;
    private UUID employmentId;
    private LocalDate usageDate;
    private BigDecimal hoursUsed;

    public EquipmentUsage() {}

    public UUID getUsageId() { return usageId; }
    public void setUsageId(UUID usageId) { this.usageId = usageId; }
    public UUID getEquipmentId() { return equipmentId; }
    public void setEquipmentId(UUID equipmentId) { this.equipmentId = equipmentId; }
    public UUID getEmploymentId() { return employmentId; }
    public void setEmploymentId(UUID employmentId) { this.employmentId = employmentId; }
    public LocalDate getUsageDate() { return usageDate; }
    public void setUsageDate(LocalDate usageDate) { this.usageDate = usageDate; }
    public BigDecimal getHoursUsed() { return hoursUsed; }
    public void setHoursUsed(BigDecimal hoursUsed) { this.hoursUsed = hoursUsed; }
}
