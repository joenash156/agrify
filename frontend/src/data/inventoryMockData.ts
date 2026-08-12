import type { Inventory } from "../types/inventory";
import type { StatCardData } from "../types/dashboard";
import { faBoxesStacked, faWarehouse, faLocationDot, faReceipt } from "@fortawesome/free-solid-svg-icons";

export const MOCK_INVENTORY: Inventory[] = [
  { inventoryId: "inv-001", harvestId: "hv-001", itemName: "Tomatoes (Roma F1)", quantity: 380, unit: "kg", storageLocation: "Warehouse A - Cold Room 1" },
  { inventoryId: "inv-002", harvestId: "hv-002", itemName: "Cocoa Beans (Hybrid, dried)", quantity: 300, unit: "kg", storageLocation: "Warehouse C - Dry Store" },
  { inventoryId: "inv-003", harvestId: "hv-003", itemName: "Cassava Tubers", quantity: 850, unit: "kg", storageLocation: "Warehouse B - Root Cellar" },
  { inventoryId: "inv-004", harvestId: "hv-005", itemName: "Groundnuts (shelled)", quantity: 240, unit: "kg", storageLocation: "Warehouse A - Dry Store" },
  { inventoryId: "inv-005", harvestId: "hv-004", itemName: "Tomatoes (Roma F1, grade B)", quantity: 150, unit: "kg", storageLocation: "Warehouse A - Cold Room 2" },
];

export const INVENTORY_STATS: StatCardData[] = [
  { id: "items", title: "Inventory Items", value: 142, change: "+18", trend: "up", subtitle: "Across 3 storage units", icon: faBoxesStacked, accentColor: "purple" },
  { id: "total-qty", title: "Total Stored", value: "1,920 kg", trend: "up", subtitle: "Combined weight in storage", icon: faWarehouse, accentColor: "teal" },
  { id: "locations", title: "Storage Locations", value: 3, trend: "neutral", subtitle: "Active warehouses", icon: faLocationDot, accentColor: "blue" },
  { id: "ready", title: "Ready for Sale", value: 5, trend: "up", subtitle: "Available inventory batches", icon: faReceipt, accentColor: "amber" },
];
