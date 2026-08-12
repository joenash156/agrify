import type { UserProfile } from "../types/user";
import type { StatCardData } from "../types/dashboard";
import {
  faTractor,
  faSeedling,
  faUsers,
  faBoxesStacked,
  faWheatAwn,
  faReceipt,
  faCreditCard,
  faClipboardUser,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";

// Demo user — replace with real auth session later
export const MOCK_USER: UserProfile = {
  id: "usr-0001",
  firstName: "Samuel",
  lastName: "Adjei",
  email: "samuel.adjei@agrify.io",
  phone: "+233 20 000 0001",
  role: "ADMIN",
  farmName: "Green Valley Estate",
};

// ── Stat cards: Admin sees everything, workers see their scope ──
export function getDashboardStats(role: UserProfile["role"]): StatCardData[] {
  const adminStats: StatCardData[] = [
    {
      id: "farms",
      title: "Total Farms",
      value: 4,
      change: "+1",
      trend: "up",
      subtitle: "3 active, 1 seasonal",
      icon: faTractor,
      accentColor: "teal",
    },
    {
      id: "employees",
      title: "Active Employees",
      value: 38,
      change: "+3",
      trend: "up",
      subtitle: "Across all farms",
      icon: faUsers,
      accentColor: "blue",
    },
    {
      id: "crops",
      title: "Active Crops",
      value: 12,
      change: "-2",
      trend: "down",
      subtitle: "Harvest due in 14 days",
      icon: faSeedling,
      accentColor: "amber",
    },
    {
      id: "harvests",
      title: "Harvests This Month",
      value: 7,
      change: "+2",
      trend: "up",
      subtitle: "480 kg total yield",
      icon: faWheatAwn,
      accentColor: "orange",
    },
    {
      id: "inventory",
      title: "Inventory Items",
      value: 142,
      change: "+18",
      trend: "up",
      subtitle: "Across 3 storage units",
      icon: faBoxesStacked,
      accentColor: "purple",
    },
    {
      id: "sales",
      title: "Sales This Month",
      value: "₵ 24,800",
      change: "+12%",
      trend: "up",
      subtitle: "19 completed orders",
      icon: faReceipt,
      accentColor: "teal",
    },
    {
      id: "payments",
      title: "Outstanding Payments",
      value: "₵ 4,200",
      change: "-8%",
      trend: "up",
      subtitle: "6 pending settlements",
      icon: faCreditCard,
      accentColor: "rose",
    },
    {
      id: "equipment",
      title: "Equipment Units",
      value: 15,
      change: "0",
      trend: "neutral",
      subtitle: "2 under maintenance",
      icon: faWrench,
      accentColor: "amber",
    },
  ];

  const salesPersonStats: StatCardData[] = [
    {
      id: "sales",
      title: "My Sales This Month",
      value: "₵ 9,400",
      change: "+6%",
      trend: "up",
      subtitle: "7 completed orders",
      icon: faReceipt,
      accentColor: "teal",
    },
    {
      id: "payments",
      title: "Pending Payments",
      value: "₵ 1,100",
      change: "-3",
      trend: "up",
      subtitle: "2 awaiting settlement",
      icon: faCreditCard,
      accentColor: "rose",
    },
    {
      id: "inventory",
      title: "Available Inventory",
      value: 54,
      change: "+5",
      trend: "up",
      subtitle: "Items ready to sell",
      icon: faBoxesStacked,
      accentColor: "purple",
    },
    {
      id: "attendance",
      title: "Attendance This Month",
      value: "22 / 23",
      trend: "neutral",
      subtitle: "1 absence recorded",
      icon: faClipboardUser,
      accentColor: "blue",
    },
  ];

  const workerStats: StatCardData[] = [
    {
      id: "crops",
      title: "Assigned Crops",
      value: 3,
      trend: "neutral",
      subtitle: "2 due for inspection",
      icon: faSeedling,
      accentColor: "amber",
    },
    {
      id: "equipment",
      title: "Equipment Assigned",
      value: 2,
      trend: "neutral",
      subtitle: "Last used today",
      icon: faWrench,
      accentColor: "teal",
    },
    {
      id: "attendance",
      title: "Attendance This Month",
      value: "21 / 23",
      trend: "neutral",
      subtitle: "2 absences recorded",
      icon: faClipboardUser,
      accentColor: "blue",
    },
    {
      id: "harvests",
      title: "Harvests Recorded",
      value: 4,
      change: "+1",
      trend: "up",
      subtitle: "This season",
      icon: faWheatAwn,
      accentColor: "orange",
    },
  ];

  if (role === "ADMIN" || role === "FARM_MANAGER") return adminStats;
  if (role === "SALES_PERSON") return salesPersonStats;
  return workerStats;
}

// Chart data for admin/manager dashboard
export const HARVEST_CHART_DATA = [
  { month: "Mar", yield: 210 },
  { month: "Apr", yield: 340 },
  { month: "May", yield: 290 },
  { month: "Jun", yield: 480 },
  { month: "Jul", yield: 390 },
  { month: "Aug", yield: 480 },
];

export const SALES_CHART_DATA = [
  { month: "Mar", revenue: 12400 },
  { month: "Apr", revenue: 18200 },
  { month: "May", revenue: 15800 },
  { month: "Jun", revenue: 21400 },
  { month: "Jul", revenue: 19600 },
  { month: "Aug", revenue: 24800 },
];

export const CROP_STATUS_DATA = [
  { name: "Growing", value: 7, color: "#14b8a6" },
  { name: "Ready", value: 3, color: "#f59e0b" },
  { name: "Harvested", value: 2, color: "#6366f1" },
];

export const RECENT_SALES = [
  { id: "SL-001", customer: "Kofi Mensah", items: 3, amount: "₵ 1,240", status: "Paid",    date: "Aug 12" },
  { id: "SL-002", customer: "Ama Boateng",   items: 1, amount: "₵ 580",   status: "Pending", date: "Aug 11" },
  { id: "SL-003", customer: "Kwame Asante",  items: 5, amount: "₵ 2,100", status: "Paid",    date: "Aug 11" },
  { id: "SL-004", customer: "Abena Frimpong",items: 2, amount: "₵ 840",   status: "Overdue", date: "Aug 10" },
  { id: "SL-005", customer: "Yaw Darko",     items: 4, amount: "₵ 1,620", status: "Paid",    date: "Aug 10" },
];

export const UPCOMING_HARVESTS = [
  { crop: "Tomatoes",    variety: "Roma",       farm: "Green Valley",  daysLeft: 3,  quantity: "120 kg" },
  { crop: "Maize",       variety: "Yellow Dent",farm: "North Fields",  daysLeft: 8,  quantity: "240 kg" },
  { crop: "Cabbage",     variety: "Savoy",      farm: "Green Valley",  daysLeft: 14, quantity: "80 kg"  },
  { crop: "Sweet Pepper",variety: "Bell",       farm: "East Ridge",    daysLeft: 21, quantity: "60 kg"  },
];
