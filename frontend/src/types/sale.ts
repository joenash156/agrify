export interface Sale {
  saleId: string;
  customerId: string;
  customerName: string;
  employmentId: string;
  soldBy: string;
  saleDate: string;
  total: number;
  itemCount: number;
  saleStatus: "PAID" | "PENDING" | "OVERDUE" | "CANCELLED";
}
