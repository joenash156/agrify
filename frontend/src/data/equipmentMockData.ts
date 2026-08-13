import type { Equipment } from "../types/equipment";
import type { StatCardData } from "../types/dashboard";
import { faWrench, faCircleCheck, faScrewdriverWrench, faTractor } from "@fortawesome/free-solid-svg-icons";

export const MOCK_EQUIPMENT: Equipment[] = [
  { equipmentId: "eq-001", farmId: "farm-001", farmName: "Green Valley Estate", equipmentName: "John Deere 5075E", equipmentType: "Tractor", purchaseDate: "2022-03-10", purchaseCost: 42000, equipmentStatus: "AVAILABLE" },
  { equipmentId: "eq-002", farmId: "farm-002", farmName: "North Fields Agriculture", equipmentName: "Irrigation Pump Set", equipmentType: "Irrigation", purchaseDate: "2021-11-02", purchaseCost: 6200, equipmentStatus: "MAINTENANCE" },
  { equipmentId: "eq-003", farmId: "farm-001", farmName: "Green Valley Estate", equipmentName: "Massey Ferguson Plough", equipmentType: "Tillage", purchaseDate: "2020-06-15", purchaseCost: 8800, equipmentStatus: "IN_USE" },
  { equipmentId: "eq-004", farmId: "farm-003", farmName: "East Ridge Farm", equipmentName: "Knapsack Sprayer Rig", equipmentType: "Spraying", purchaseDate: "2023-02-20", purchaseCost: 1400, equipmentStatus: "AVAILABLE" },
  { equipmentId: "eq-005", farmId: "farm-002", farmName: "North Fields Agriculture", equipmentName: "Grain Harvester", equipmentType: "Harvesting", purchaseDate: "2019-09-01", purchaseCost: 65000, equipmentStatus: "BROKEN" },
  { equipmentId: "eq-006", farmId: "farm-004", farmName: "Sunrise Agro Holdings", equipmentName: "Utility Trailer", equipmentType: "Transport", purchaseDate: "2018-04-12", purchaseCost: 3200, equipmentStatus: "RETIRED" },
];

export const EQUIPMENT_STATS: StatCardData[] = [
  { id: "total", title: "Total Equipment", value: 6, trend: "neutral", subtitle: "Registered assets", icon: faWrench, accentColor: "teal" },
  { id: "operational", title: "Operational", value: 3, trend: "up", subtitle: "Ready for use", icon: faCircleCheck, accentColor: "blue" },
  { id: "maintenance", title: "In Maintenance", value: 1, trend: "neutral", subtitle: "Currently serviced", icon: faScrewdriverWrench, accentColor: "amber" },
  { id: "value", title: "Total Asset Value", value: "₵ 126,600", trend: "neutral", subtitle: "Combined purchase cost", icon: faTractor, accentColor: "purple" },
];
