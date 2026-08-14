import { createCrudService } from "./crudServiceFactory";
import type { Payment } from "../types/payment";

/** Raw shape from the backend — no joined customerName (DAO doesn't join sale -> customer). */
export interface PaymentRecordDto {
  paymentId: string;
  publicId: string;
  saleId: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: Payment["paymentStatus"];
  paymentDate: string;
}

interface PaymentCreateDto {
  saleId: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: Payment["paymentStatus"];
}

export const paymentService = createCrudService<PaymentRecordDto, PaymentCreateDto>("/payment");
