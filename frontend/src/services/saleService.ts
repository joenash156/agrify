import { httpClient } from "./httpClient";
import type { Sale } from "../types/sale";

interface SaleSummaryResponse {
  saleId: string;
  publicId: string;
  customerId: string | null;
  customerName: string | null;
  employmentId: string;
  soldByName: string;
  saleDate: string;
  total: number;
  saleStatus: Sale["saleStatus"];
  itemCount: number;
  voided: boolean;
  voidedAt: string | null;
  voidedReason: string | null;
  voidedByName: string | null;
}

interface SaleDto {
  customerId: string;
  employmentId: string;
  total: number;
  saleStatus: Sale["saleStatus"];
}

interface SaleResponse {
  saleId: string;
  customerId: string | null;
  employmentId: string;
  saleDate: string;
  total: number;
  saleStatus: Sale["saleStatus"];
}

function toSale(dto: SaleSummaryResponse): Sale {
  return {
    saleId: dto.saleId,
    publicId: dto.publicId,
    customerId: dto.customerId ?? "",
    customerName: dto.customerName ?? "Walk-in Customer",
    employmentId: dto.employmentId,
    soldBy: dto.soldByName,
    saleDate: dto.saleDate,
    total: dto.total,
    itemCount: dto.itemCount,
    saleStatus: dto.saleStatus,
    isVoided: dto.voided,
    voidedAt: dto.voidedAt,
    voidedReason: dto.voidedReason,
    voidedByName: dto.voidedByName,
  };
}

export const saleService = {
  /** List view joined with customer/staff names and item counts — what the Sales & Orders page renders. */
  findAll: async (): Promise<Sale[]> => {
    const { data } = await httpClient.get<SaleSummaryResponse[]>("/sale/summary");
    return data.map(toSale);
  },
  create: async (payload: SaleDto): Promise<SaleResponse> => (await httpClient.post<SaleResponse>("/sale", payload)).data,
  update: async (id: string, payload: SaleDto): Promise<void> => {
    await httpClient.put(`/sale/${id}`, payload);
  },
  voidSale: async (id: string, reason: string): Promise<void> => {
    await httpClient.put(`/sale/${id}/void`, { reason });
  },
};
