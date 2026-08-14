import { httpClient } from "./httpClient";
import type { StatCardData } from "../types/dashboard";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faTractor,
  faUsers,
  faSeedling,
  faWheatAwn,
  faBoxesStacked,
  faReceipt,
  faCreditCard,
  faWrench,
  faCartShopping,
  faClock,
  faChartPie,
} from "@fortawesome/free-solid-svg-icons";

interface StatCardResponse {
  id: string;
  title: string;
  value: string;
  change: string | null;
  trend: "up" | "down" | "neutral" | null;
  subtitle: string | null;
}

type ChartRow = Record<string, string | number>;

interface OverviewResponse {
  stats: StatCardResponse[];
  charts: Record<string, ChartRow[]>;
}

export interface DashboardOverview {
  stats: StatCardData[];
  charts: {
    salesChart: ChartRow[];
    harvestChart: ChartRow[];
    cropStatusChart: ChartRow[];
    mySalesTrend: ChartRow[];
    myOrderStatus: ChartRow[];
    myAttendance: ChartRow[];
    myCropsStatus: ChartRow[];
  };
}

// Icon keyed by the stat `id` the backend assigns (see DashboardService.java) —
// the backend can only send plain data, not a FontAwesome icon component.
const STAT_ICONS: Record<string, IconDefinition> = {
  farms: faTractor,
  employees: faUsers,
  crops: faSeedling,
  harvests: faWheatAwn,
  inventory: faBoxesStacked,
  sales: faReceipt,
  payments: faCreditCard,
  equipment: faWrench,
  orders: faCartShopping,
  pending: faClock,
};

const STATUS_COLORS: Record<string, string> = {
  GROWING: "#14b8a6",
  READY: "#f59e0b",
  HARVESTED: "#8b5cf6",
  DISEASED: "#ef4444",
  DORMANT: "#71717a",
  PAID: "#14b8a6",
  PARTIALLY_PAID: "#f59e0b",
  UNPAID: "#ef4444",
  CANCELLED: "#71717a",
  PRESENT: "#14b8a6",
  LATE: "#f59e0b",
  ABSENT: "#ef4444",
  LEAVE: "#3b82f6",
};

function toStatCardData(dto: StatCardResponse): StatCardData {
  return {
    id: dto.id,
    title: dto.title,
    value: dto.value,
    change: dto.change ?? undefined,
    trend: dto.trend ?? "neutral",
    subtitle: dto.subtitle ?? undefined,
    icon: STAT_ICONS[dto.id] ?? faChartPie,
    accentColor: "teal",
  };
}

function withColors(rows: ChartRow[]): ChartRow[] {
  return rows.map((row) => ({ ...row, color: STATUS_COLORS[String(row.name ?? "")] ?? "#14b8a6" }));
}

export async function getDashboardOverview(from?: string | null, to?: string | null): Promise<DashboardOverview> {
  const { data } = await httpClient.get<OverviewResponse>("/dashboard/overview", {
    params: { from: from ?? undefined, to: to ?? undefined },
  });
  const charts = data.charts;
  return {
    stats: data.stats.map(toStatCardData),
    charts: {
      salesChart: charts.salesChart ?? [],
      harvestChart: charts.harvestChart ?? [],
      cropStatusChart: withColors(charts.cropStatusChart ?? []),
      mySalesTrend: charts.mySalesTrend ?? [],
      myOrderStatus: withColors(charts.myOrderStatus ?? []),
      myAttendance: charts.myAttendance ?? [],
      myCropsStatus: withColors(charts.myCropsStatus ?? []),
    },
  };
}
