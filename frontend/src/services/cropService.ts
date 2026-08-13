import { createCrudService } from "./crudServiceFactory";
import type { Crop } from "../types/crop";

interface CropDto {
  farmId: string;
  cropName: string;
  cropVariety: string;
  plantingDate: string;
  expectedHarvestDate: string;
  cropStatus: Crop["cropStatus"];
}

export const cropService = createCrudService<Crop, CropDto>("/crop");
