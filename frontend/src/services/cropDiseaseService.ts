import { httpClient } from "./httpClient";
import type { DiseaseSeverity } from "../types/disease";

/**
 * Raw crop-disease incident record as returned by the backend — no joined
 * crop/disease/farm names (the DAO doesn't join). Pages needing display
 * names currently resolve them client-side from the crop/disease lists.
 */
export interface CropDiseaseRecordDto {
  cropDiseaseId: string;
  cropId: string;
  diseaseId: string;
  detectedDate: string;
  severity: DiseaseSeverity;
  treatment: string;
}

interface CropDiseaseCreateDto {
  cropId: string;
  diseaseId: string;
  detectedDate: string;
  severity: DiseaseSeverity;
  treatment: string;
}

const BASE_PATH = "/crop-diseases";

export const cropDiseaseService = {
  findAll: async (): Promise<CropDiseaseRecordDto[]> => (await httpClient.get<CropDiseaseRecordDto[]>(BASE_PATH)).data,
  findByCrop: async (cropId: string): Promise<CropDiseaseRecordDto[]> =>
    (await httpClient.get<CropDiseaseRecordDto[]>(`${BASE_PATH}/crop/${cropId}`)).data,
  create: async (payload: CropDiseaseCreateDto): Promise<CropDiseaseRecordDto> =>
    (await httpClient.post<CropDiseaseRecordDto>(BASE_PATH, payload)).data,
  remove: async (id: string): Promise<void> => {
    await httpClient.delete(`${BASE_PATH}/${id}`);
  },
};
