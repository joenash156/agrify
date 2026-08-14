export interface Payment {
  paymentId: string;
  publicId: string;
  saleId: string;
  salePublicId: string;
  customerName: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  paymentStatus: "CONFIRMED" | "PENDING" | "FAILED" | "REFUNDED";
}
