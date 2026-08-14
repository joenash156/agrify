export interface Sale {
  saleId: string;
  publicId: string;
  customerId: string;
  customerName: string;
  employmentId: string;
  soldBy: string;
  saleDate: string;
  total: number;
  itemCount: number;
  saleStatus: "PAID" | "PARTIALLY_PAID" | "UNPAID" | "CANCELLED";
  isVoided: boolean;
  voidedAt: string | null;
  voidedReason: string | null;
  voidedByName: string | null;
}
