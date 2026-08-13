import { httpClient } from "./httpClient";
import type { Sale } from "../types/sale";

interface SaleSummaryResponse {
  saleId: string;
  customerId: string | null;
  customerName: string | null;
  employmentId: string;
  soldByName: string;
  saleDate: string;
  total: number;
  saleStatus: Sale["saleStatus"];
  itemCount: number;
}

interface SaleDto {
  customerId: string;
  employmentId: string;
  total: number;
  saleStatus: Sale["saleStatus"];
}

function toSale(dto: SaleSummaryResponse): Sale {
  return {
    saleId: dto.saleId,
    customerId: dto.customerId ?? "",
    customerName: dto.customerName ?? "Walk-in Customer",
    employmentId: dto.employmentId,
    soldBy: dto.soldByName,
    saleDate: dto.saleDate,
    total: dto.total,
    itemCount: dto.itemCount,
    saleStatus: dto.saleStatus,
  };
}

export const saleService = {
  /** List view joined with customer/staff names and item counts — what the Sales & Orders page renders. */
  findAll: async (): Promise<Sale[]> => {
    const { data } = await httpClient.get<SaleSummaryResponse[]>("/sale/summary");
    return data.map(toSale);
  },
  create: async (payload: SaleDto): Promise<void> => {
    await httpClient.post("/sale", payload);
  },
  update: async (id: string, payload: SaleDto): Promise<void> => {
    await httpClient.put(`/sale/${id}`, payload);
  },
  remove: async (id: string): Promise<void> => {
    await httpClient.delete(`/sale/${id}`);
  },
};
