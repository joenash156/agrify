package com.farmmanagement.dto;

import java.util.UUID;

import java.time.LocalDate;

public class CropDiseaseDto {
    private UUID cropId;
    private UUID diseaseId;
    private LocalDate detectedDate;
    private String severity;
    private String treatment;
    public CropDiseaseDto() {}
    public UUID getCropId(){return cropId;} public void setCropId(UUID v){cropId=v;}
    public UUID getDiseaseId(){return diseaseId;} public void setDiseaseId(UUID v){diseaseId=v;}
    public LocalDate getDetectedDate(){return detectedDate;} public void setDetectedDate(LocalDate v){detectedDate=v;}
    public String getSeverity(){return severity;} public void setSeverity(String v){severity=v;}
    public String getTreatment(){return treatment;} public void setTreatment(String v){treatment=v;}
}
