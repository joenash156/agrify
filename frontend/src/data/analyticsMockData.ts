import type { StatCardData } from "../types/dashboard";
import {
  faSackDollar,
  faWheatAwn,
  faTractor,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export const ANALYTICS_STATS: StatCardData[] = [
  { id: "revenue-ytd", title: "Total Revenue (YTD)", value: "₵ 205,300", change: "+18%", trend: "up", subtitle: "Across all farms", icon: faSackDollar, accentColor: "teal" },
  { id: "yield-ytd", title: "Total Harvest Yield (YTD)", value: "3,458 kg", change: "+9%", trend: "up", subtitle: "All crops combined", icon: faWheatAwn, accentColor: "orange" },
  { id: "active-farms", title: "Active Farms", value: 3, trend: "neutral", subtitle: "Out of 4 registered", icon: faTractor, accentColor: "blue" },
  { id: "total-employees", title: "Total Employees", value: 38, change: "+3", trend: "up", subtitle: "Across all farms", icon: faUsers, accentColor: "purple" },
];

export const FARM_REVENUE_DATA = [
  { farm: "Green Valley", revenue: 82400 },
  { farm: "North Fields", revenue: 64200 },
  { farm: "East Ridge", revenue: 38700 },
  { farm: "Sunrise Agro", revenue: 20000 },
];

export const PAYMENT_STATUS_BREAKDOWN = [
  { name: "Completed", value: 3, color: "#14b8a6" },
  { name: "Pending", value: 1, color: "#f59e0b" },
  { name: "Failed", value: 1, color: "#ef4444" },
  { name: "Refunded", value: 1, color: "#6366f1" },
];

export const EQUIPMENT_STATUS_BREAKDOWN = [
  { name: "Operational", value: 3, color: "#14b8a6" },
  { name: "Maintenance", value: 1, color: "#f59e0b" },
  { name: "Broken", value: 1, color: "#ef4444" },
  { name: "Retired", value: 1, color: "#71717a" },
];
