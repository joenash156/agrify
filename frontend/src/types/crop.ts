export interface Crop {
  cropId: string;
  farmId: string;
  farmName: string;
  cropName: string;
  cropVariety: string;
  plantingDate: string;
  expectedHarvestDate: string;
  cropStatus: "GROWING" | "READY" | "HARVESTED" | "DISEASED" | "DORMANT";
}
