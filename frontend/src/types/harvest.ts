export interface Harvest {
  harvestId: string;
  cropId: string;
  cropName: string;
  farmName: string;
  harvestDate: string;
  quantity: number;
  unit: string;
  qualityGrade: "PREMIUM" | "STANDARD" | "SUBSTANDARD";
}
