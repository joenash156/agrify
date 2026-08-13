package com.farmmanagement.dto;

import java.util.UUID;

import java.math.BigDecimal;
import java.time.LocalDate;

public class EquipmentUsageDto {
    private UUID equipmentId;
    private UUID employmentId;
    private LocalDate usageDate;
    private BigDecimal hoursUsed;

    public EquipmentUsageDto() {}

    public UUID getEquipmentId() { return equipmentId; }
    public void setEquipmentId(UUID equipmentId) { this.equipmentId = equipmentId; }
    public UUID getEmploymentId() { return employmentId; }
    public void setEmploymentId(UUID employmentId) { this.employmentId = employmentId; }
    public LocalDate getUsageDate() { return usageDate; }
    public void setUsageDate(LocalDate usageDate) { this.usageDate = usageDate; }
    public BigDecimal getHoursUsed() { return hoursUsed; }
    public void setHoursUsed(BigDecimal hoursUsed) { this.hoursUsed = hoursUsed; }
}
