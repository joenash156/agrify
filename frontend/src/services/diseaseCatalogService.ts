import { createCrudService } from "./crudServiceFactory";

/** The DISEASE catalog table (name + description) — distinct from crop-disease incident records. */
export interface DiseaseCatalogEntry {
  diseaseId: string;
  diseaseName: string;
  description: string;
}

interface DiseaseCatalogDto {
  diseaseName: string;
  description: string;
}

export const diseaseCatalogService = createCrudService<DiseaseCatalogEntry, DiseaseCatalogDto>("/disease");
