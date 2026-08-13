import { createCrudService } from "./crudServiceFactory";
import type { Inventory } from "../types/inventory";

interface InventoryDto {
  harvestId: string;
  itemName: string;
  quantity: number;
  unit: string;
  storageLocation: string;
}

export const inventoryService = createCrudService<Inventory, InventoryDto>("/inventory");
