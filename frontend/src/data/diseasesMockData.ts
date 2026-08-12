import type { CropDiseaseRecord } from "../types/disease";
import type { StatCardData } from "../types/dashboard";
import { faBug, faTriangleExclamation, faFlask, faCircleCheck } from "@fortawesome/free-solid-svg-icons";

export const MOCK_CROP_DISEASES: CropDiseaseRecord[] = [
  {
    cropDiseaseId: "cd-001",
    cropId: "crop-004",
    cropName: "Sweet Pepper",
    farmName: "East Ridge Farm",
    diseaseId: "dis-001",
    diseaseName: "Bacterial Wilt",
    detectedDate: "2026-07-20",
    severity: "HIGH",
    treatment: "Copper-based bactericide spray",
  },
  {
    cropDiseaseId: "cd-002",
    cropId: "crop-002",
    cropName: "Maize",
    farmName: "North Fields Agriculture",
    diseaseId: "dis-002",
    diseaseName: "Maize Streak Virus",
    detectedDate: "2026-07-05",
    severity: "MEDIUM",
    treatment: "Removed infected plants, insecticide for vector control",
  },
  {
    cropDiseaseId: "cd-003",
    cropId: "crop-006",
    cropName: "Yam",
    farmName: "Green Valley Estate",
    diseaseId: "dis-003",
    diseaseName: "Yam Anthracnose",
    detectedDate: "2026-06-18",
    severity: "LOW",
    treatment: "Fungicide application, improved field drainage",
  },
  {
    cropDiseaseId: "cd-004",
    cropId: "crop-008",
    cropName: "Groundnuts",
    farmName: "North Fields Agriculture",
    diseaseId: "dis-004",
    diseaseName: "Groundnut Rosette",
    detectedDate: "2026-07-28",
    severity: "CRITICAL",
    treatment: "Quarantined section, aphid vector control, agronomist review pending",
  },
  {
    cropDiseaseId: "cd-005",
    cropId: "crop-003",
    cropName: "Cabbage",
    farmName: "Green Valley Estate",
    diseaseId: "dis-005",
    diseaseName: "Black Rot",
    detectedDate: "2026-08-02",
    severity: "MEDIUM",
    treatment: "Crop rotation planned, affected heads removed",
  },
];

export const DISEASE_STATS: StatCardData[] = [
  { id: "active-cases", title: "Active Cases", value: 5, change: "+2", trend: "up", subtitle: "Across all farms", icon: faBug, accentColor: "rose" },
  { id: "critical", title: "Critical Severity", value: 1, trend: "up", subtitle: "Needs immediate action", icon: faTriangleExclamation, accentColor: "rose" },
  { id: "treatment", title: "Under Treatment", value: 5, trend: "neutral", subtitle: "Treatment in progress", icon: faFlask, accentColor: "amber" },
  { id: "resolved", title: "Resolved This Month", value: 3, change: "+3", trend: "up", subtitle: "Fully recovered crops", icon: faCircleCheck, accentColor: "teal" },
];
