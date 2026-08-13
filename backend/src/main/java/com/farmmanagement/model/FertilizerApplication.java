package com.farmmanagement.model;

import java.util.UUID;

import java.math.BigDecimal;
import java.time.LocalDate;

public class FertilizerApplication {
    private UUID applicationId;
    private UUID cropId;
    private UUID employmentId;
    private UUID fertilizerId;
    private LocalDate applicationDate;
    private BigDecimal quantity;
    private String notes;

    public FertilizerApplication() {}

    public UUID getApplicationId() { return applicationId; }
    public void setApplicationId(UUID applicationId) { this.applicationId = applicationId; }
    public UUID getCropId() { return cropId; }
    public void setCropId(UUID cropId) { this.cropId = cropId; }
    public UUID getEmploymentId() { return employmentId; }
    public void setEmploymentId(UUID employmentId) { this.employmentId = employmentId; }
    public UUID getFertilizerId() { return fertilizerId; }
    public void setFertilizerId(UUID fertilizerId) { this.fertilizerId = fertilizerId; }
    public LocalDate getApplicationDate() { return applicationDate; }
    public void setApplicationDate(LocalDate applicationDate) { this.applicationDate = applicationDate; }
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
