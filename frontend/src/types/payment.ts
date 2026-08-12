export interface Payment {
  paymentId: string;
  saleId: string;
  customerName: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  paymentStatus: "COMPLETED" | "PENDING" | "FAILED" | "REFUNDED";
}
