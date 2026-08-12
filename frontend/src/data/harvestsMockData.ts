import type { Harvest } from "../types/harvest";
import type { StatCardData } from "../types/dashboard";
import { faWheatAwn, faSeedling, faStar, faBoxesStacked } from "@fortawesome/free-solid-svg-icons";

export const MOCK_HARVESTS: Harvest[] = [
  { harvestId: "hv-001", cropId: "crop-001", cropName: "Tomatoes", farmName: "Green Valley Estate", harvestDate: "2026-08-10", quantity: 420, unit: "kg", qualityGrade: "PREMIUM" },
  { harvestId: "hv-002", cropId: "crop-007", cropName: "Cocoa", farmName: "East Ridge Farm", harvestDate: "2026-08-05", quantity: 310, unit: "kg", qualityGrade: "STANDARD" },
  { harvestId: "hv-003", cropId: "crop-005", cropName: "Cassava", farmName: "North Fields Agriculture", harvestDate: "2026-07-28", quantity: 900, unit: "kg", qualityGrade: "STANDARD" },
  { harvestId: "hv-004", cropId: "crop-001", cropName: "Tomatoes", farmName: "Green Valley Estate", harvestDate: "2026-07-15", quantity: 180, unit: "kg", qualityGrade: "SUBSTANDARD" },
  { harvestId: "hv-005", cropId: "crop-008", cropName: "Groundnuts", farmName: "North Fields Agriculture", harvestDate: "2026-07-02", quantity: 260, unit: "kg", qualityGrade: "PREMIUM" },
];

export const HARVEST_STATS: StatCardData[] = [
  { id: "total-harvests", title: "Harvests This Month", value: 7, change: "+2", trend: "up", subtitle: "480 kg total yield", icon: faWheatAwn, accentColor: "orange" },
  { id: "total-yield", title: "Total Yield (YTD)", value: "2,070 kg", change: "+12%", trend: "up", subtitle: "Across all farms", icon: faSeedling, accentColor: "teal" },
  { id: "premium", title: "Premium Grade", value: 2, trend: "up", subtitle: "Top quality harvests", icon: faStar, accentColor: "purple" },
  { id: "pending", title: "Pending Storage", value: 1, trend: "neutral", subtitle: "Awaiting inventory intake", icon: faBoxesStacked, accentColor: "blue" },
];
