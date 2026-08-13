package com.farmmanagement.model;

import java.util.UUID;

public class Disease {
    private UUID diseaseId;
    private String diseaseName;
    private String description;

    public Disease() {}

    public UUID getDiseaseId() { return diseaseId; }
    public void setDiseaseId(UUID diseaseId) { this.diseaseId = diseaseId; }
    public String getDiseaseName() { return diseaseName; }
    public void setDiseaseName(String diseaseName) { this.diseaseName = diseaseName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
