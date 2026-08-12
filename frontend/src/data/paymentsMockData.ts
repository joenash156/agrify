import type { Payment } from "../types/payment";
import type { StatCardData } from "../types/dashboard";
import { faCreditCard, faReceipt, faTriangleExclamation, faRotateLeft } from "@fortawesome/free-solid-svg-icons";

export const MOCK_PAYMENTS: Payment[] = [
  { paymentId: "PM-001", saleId: "SL-001", customerName: "Kofi Mensah", amount: 1240, paymentMethod: "Mobile Money", paymentDate: "2026-08-12", paymentStatus: "COMPLETED" },
  { paymentId: "PM-002", saleId: "SL-003", customerName: "Kwame Asante", amount: 2100, paymentMethod: "Bank Transfer", paymentDate: "2026-08-11", paymentStatus: "COMPLETED" },
  { paymentId: "PM-003", saleId: "SL-005", customerName: "Yaw Darko", amount: 1620, paymentMethod: "Cash", paymentDate: "2026-08-10", paymentStatus: "COMPLETED" },
  { paymentId: "PM-004", saleId: "SL-002", customerName: "Ama Boateng", amount: 580, paymentMethod: "Mobile Money", paymentDate: "2026-08-11", paymentStatus: "PENDING" },
  { paymentId: "PM-005", saleId: "SL-004", customerName: "Abena Frimpong", amount: 840, paymentMethod: "Bank Transfer", paymentDate: "2026-08-10", paymentStatus: "FAILED" },
  { paymentId: "PM-006", saleId: "SL-006", customerName: "Efua Owusu", amount: 460, paymentMethod: "Cash", paymentDate: "2026-08-09", paymentStatus: "REFUNDED" },
];

export const PAYMENT_STATS: StatCardData[] = [
  { id: "collected", title: "Collected This Month", value: "₵ 20,600", change: "+9%", trend: "up", subtitle: "Across all methods", icon: faCreditCard, accentColor: "teal" },
  { id: "outstanding", title: "Outstanding Payments", value: "₵ 4,200", change: "-8%", trend: "up", subtitle: "6 pending settlements", icon: faReceipt, accentColor: "rose" },
  { id: "failed", title: "Failed Payments", value: 1, trend: "down", subtitle: "Needs retry or follow-up", icon: faTriangleExclamation, accentColor: "amber" },
  { id: "refunded", title: "Refunded", value: 1, trend: "neutral", subtitle: "This month", icon: faRotateLeft, accentColor: "blue" },
];
