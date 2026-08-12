export type DiseaseSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface CropDiseaseRecord {
  cropDiseaseId: string;
  cropId: string;
  cropName: string;
  farmName: string;
  diseaseId: string;
  diseaseName: string;
  detectedDate: string;
  severity: DiseaseSeverity;
  treatment: string;
}
