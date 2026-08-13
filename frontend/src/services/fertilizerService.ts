import { createCrudService } from "./crudServiceFactory";
import type { Fertilizer } from "../types/fertilizer";

interface FertilizerDto {
  fertilizerName: string;
  fertilizerType: string;
  unitPrice: number;
  quantity: number;
}

export const fertilizerService = createCrudService<Fertilizer, FertilizerDto>("/fertilizer");
