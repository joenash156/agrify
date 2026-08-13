export interface Sale {
  saleId: string;
  customerId: string;
  customerName: string;
  employmentId: string;
  soldBy: string;
  saleDate: string;
  total: number;
  itemCount: number;
  saleStatus: "PAID" | "PARTIALLY_PAID" | "UNPAID" | "CANCELLED";
}
