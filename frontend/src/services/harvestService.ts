import { createCrudService } from "./crudServiceFactory";
import type { Harvest } from "../types/harvest";

/** Raw shape from the backend — no joined cropName/farmName (DAO doesn't join). */
export interface HarvestRecordDto {
  harvestId: string;
  cropId: string;
  harvestDate: string;
  quantity: number;
  unit: string;
  qualityGrade: Harvest["qualityGrade"];
}

interface HarvestCreateDto {
  cropId: string;
  harvestDate: string;
  quantity: number;
  unit: string;
  qualityGrade: Harvest["qualityGrade"];
}

export const harvestService = createCrudService<HarvestRecordDto, HarvestCreateDto>("/harvest");
