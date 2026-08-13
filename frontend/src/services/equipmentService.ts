import { createCrudService } from "./crudServiceFactory";
import type { Equipment } from "../types/equipment";

interface EquipmentDto {
  farmId: string;
  equipmentName: string;
  equipmentType: string;
  purchaseDate: string;
  purchaseCost: number;
  equipmentStatus: Equipment["equipmentStatus"];
}

export const equipmentService = createCrudService<Equipment, EquipmentDto>("/equipment");
