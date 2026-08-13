import type { Sale } from "../types/sale";
import type { StatCardData } from "../types/dashboard";
import { faReceipt, faCartShopping, faClock, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

export const MOCK_SALES: Sale[] = [
  { saleId: "SL-001", customerId: "cus-001", customerName: "Kofi Mensah", employmentId: "emp-100", soldBy: "Samuel Adjei", saleDate: "2026-08-12", total: 1240, itemCount: 3, saleStatus: "PAID" },
  { saleId: "SL-002", customerId: "cus-002", customerName: "Ama Boateng", employmentId: "emp-101", soldBy: "Ama Serwaa", saleDate: "2026-08-11", total: 580, itemCount: 1, saleStatus: "PENDING" },
  { saleId: "SL-003", customerId: "cus-003", customerName: "Kwame Asante", employmentId: "emp-102", soldBy: "Yaw Owusu", saleDate: "2026-08-11", total: 2100, itemCount: 5, saleStatus: "PAID" },
  { saleId: "SL-004", customerId: "cus-004", customerName: "Abena Frimpong", employmentId: "emp-100", soldBy: "Samuel Adjei", saleDate: "2026-08-10", total: 840, itemCount: 2, saleStatus: "OVERDUE" },
  { saleId: "SL-005", customerId: "cus-005", customerName: "Yaw Darko", employmentId: "emp-102", soldBy: "Yaw Owusu", saleDate: "2026-08-10", total: 1620, itemCount: 4, saleStatus: "PAID" },
  { saleId: "SL-006", customerId: "cus-006", customerName: "Efua Owusu", employmentId: "emp-101", soldBy: "Ama Serwaa", saleDate: "2026-08-09", total: 460, itemCount: 1, saleStatus: "CANCELLED" },
];

export const SALES_STATS: StatCardData[] = [
  { id: "sales", title: "Sales This Month", value: "₵ 24,800", change: "+12%", trend: "up", subtitle: "19 completed orders", icon: faReceipt, accentColor: "teal" },
  { id: "orders", title: "Total Orders", value: 6, trend: "up", subtitle: "This week", icon: faCartShopping, accentColor: "blue" },
  { id: "pending", title: "Pending Orders", value: 1, trend: "neutral", subtitle: "Awaiting payment", icon: faClock, accentColor: "amber" },
  { id: "overdue", title: "Overdue Orders", value: 1, trend: "down", subtitle: "Requires follow-up", icon: faTriangleExclamation, accentColor: "rose" },
];
