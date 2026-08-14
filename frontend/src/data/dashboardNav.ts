import {
  faChartPie,
  faChartLine,
  faTractor,
  faSeedling,
  faBug,
  faWrench,
  faFlask,
  faWheatAwn,
  faBoxesStacked,
  faReceipt,
  faCreditCard,
  faUsers,
  faClipboardUser,
  faCashRegister,
} from "@fortawesome/free-solid-svg-icons";
import type { NavGroup } from "../types/dashboard";
import type { UserRole } from "../types/user";

export function getNavGroups(role: UserRole = "ADMIN"): NavGroup[] {
  const allGroups: NavGroup[] = [
    {
      label: "Main",
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: faChartPie,
        },
        {
          label: "Analytics",
          href: "/analytics",
          icon: faChartLine,
          roles: ["ADMIN", "FARM_MANAGER"],
        },
      ],
    },
    {
      label: "Farm Management",
      items: [
        {
          label: "Farms",
          href: "/farms",
          icon: faTractor,
          roles: ["ADMIN", "FARM_MANAGER"],
        },
        {
          label: "Crops & Cultivation",
          href: "/crops",
          icon: faSeedling,
        },
        {
          label: "Crop Diseases",
          href: "/diseases",
          icon: faBug,
        },
        {
          label: "Equipment & Usage",
          href: "/equipment",
          icon: faWrench,
        },
        {
          label: "Fertilizers",
          href: "/fertilizers",
          icon: faFlask,
        },
      ],
    },
    {
      label: "Commerce & Inventory",
      items: [
        {
          label: "Harvest Records",
          href: "/harvests",
          icon: faWheatAwn,
        },
        {
          label: "Inventory Storage",
          href: "/inventory",
          icon: faBoxesStacked,
        },
        {
          label: "POS Terminal",
          href: "/pos",
          icon: faCashRegister,
          roles: ["ADMIN", "FARM_MANAGER", "SALES_PERSON"],
        },
        {
          label: "Sales & Orders",
          href: "/sales",
          icon: faReceipt,
          roles: ["ADMIN", "FARM_MANAGER", "SALES_PERSON"],
        },
        {
          label: "Payments & Ledger",
          href: "/payments",
          icon: faCreditCard,
          roles: ["ADMIN", "FARM_MANAGER", "SALES_PERSON"],
        },
      ],
    },
    {
      label: "Workforce",
      items: [
        {
          label: "Employees",
          href: "/employees",
          icon: faUsers,
          roles: ["ADMIN", "FARM_MANAGER"],
        },
        {
          label: "Attendance Logs",
          href: "/attendance",
          icon: faClipboardUser,
        },
      ],
    },
  ];

  // Filter items by user role if restricted
  return allGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (!item.roles) return true;
        return item.roles.includes(role);
      }),
    }))
    .filter((group) => group.items.length > 0);
}
