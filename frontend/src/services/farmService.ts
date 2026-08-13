import { createCrudService } from "./crudServiceFactory";
import type { Farm } from "../types/farm";

interface FarmDto {
  farmName: string;
  location: string;
  size: number;
  farmStatus: Farm["farmStatus"];
}

export const farmService = createCrudService<Farm, FarmDto>("/farm");
