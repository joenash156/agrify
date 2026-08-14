import { httpClient } from "./httpClient";

export interface SaleItemDto {
  saleId: string;
  inventoryId: string;
  quantity: number;
  unitPrice: number;
}

const BASE_PATH = "/sale-items";

export const saleItemService = {
  create: async (payload: SaleItemDto): Promise<void> => {
    await httpClient.post(BASE_PATH, payload);
  },
};
