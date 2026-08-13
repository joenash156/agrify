package com.farmmanagement.model;

import java.util.UUID;

import java.time.LocalDate;

public class CropDisease {
    private UUID cropDiseaseId;
    private UUID cropId;
    private UUID diseaseId;
    private LocalDate detectedDate;
    private String severity;
    private String treatment;

    public CropDisease() {}

    public UUID getCropDiseaseId() { return cropDiseaseId; }
    public void setCropDiseaseId(UUID cropDiseaseId) { this.cropDiseaseId = cropDiseaseId; }
    public UUID getCropId() { return cropId; }
    public void setCropId(UUID cropId) { this.cropId = cropId; }
    public UUID getDiseaseId() { return diseaseId; }
    public void setDiseaseId(UUID diseaseId) { this.diseaseId = diseaseId; }
    public LocalDate getDetectedDate() { return detectedDate; }
    public void setDetectedDate(LocalDate detectedDate) { this.detectedDate = detectedDate; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public String getTreatment() { return treatment; }
    public void setTreatment(String treatment) { this.treatment = treatment; }
}
