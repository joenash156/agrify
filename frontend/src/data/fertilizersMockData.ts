import type { Fertilizer } from "../types/fertilizer";
import type { StatCardData } from "../types/dashboard";
import { faFlask, faBoxesStacked, faTriangleExclamation, faReceipt } from "@fortawesome/free-solid-svg-icons";

export const MOCK_FERTILIZERS: Fertilizer[] = [
  { fertilizerId: "fert-001", fertilizerName: "NPK 15-15-15", fertilizerType: "Compound", unitPrice: 220, quantity: 480 },
  { fertilizerId: "fert-002", fertilizerName: "Urea 46%", fertilizerType: "Nitrogen", unitPrice: 190, quantity: 150 },
  { fertilizerId: "fert-003", fertilizerName: "Muriate of Potash", fertilizerType: "Potassium", unitPrice: 260, quantity: 60 },
  { fertilizerId: "fert-004", fertilizerName: "Single Super Phosphate", fertilizerType: "Phosphorus", unitPrice: 175, quantity: 210 },
  { fertilizerId: "fert-005", fertilizerName: "Organic Compost Blend", fertilizerType: "Organic", unitPrice: 90, quantity: 820 },
];

export const FERTILIZER_STATS: StatCardData[] = [
  { id: "types", title: "Fertilizer Types", value: 5, trend: "neutral", subtitle: "Distinct products in stock", icon: faFlask, accentColor: "teal" },
  { id: "total-qty", title: "Total Stock", value: "1,720 kg", change: "+180", trend: "up", subtitle: "Across all warehouses", icon: faBoxesStacked, accentColor: "blue" },
  { id: "low-stock", title: "Low Stock Items", value: 1, trend: "down", subtitle: "Below 100kg remaining", icon: faTriangleExclamation, accentColor: "rose" },
  { id: "value", title: "Inventory Value", value: "₵ 268,400", trend: "neutral", subtitle: "Estimated stock value", icon: faReceipt, accentColor: "purple" },
];
