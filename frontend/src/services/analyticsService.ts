import { httpClient } from "./httpClient";
import type { StatCardData } from "../types/dashboard";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faSackDollar, faWheatAwn, faTractor, faUsers, faChartPie } from "@fortawesome/free-solid-svg-icons";

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

export interface AnalyticsOverview {
  stats: StatCardData[];
  charts: {
    revenueTrend: ChartRow[];
    harvestYield: ChartRow[];
    cropStatus: ChartRow[];
    revenueByFarm: ChartRow[];
    paymentStatus: ChartRow[];
    equipmentStatus: ChartRow[];
  };
}

const STAT_ICONS: Record<string, IconDefinition> = {
  "revenue-ytd": faSackDollar,
  "yield-ytd": faWheatAwn,
  "active-farms": faTractor,
  "total-employees": faUsers,
};

const STATUS_COLORS: Record<string, string> = {
  GROWING: "#14b8a6",
  READY: "#f59e0b",
  HARVESTED: "#8b5cf6",
  DISEASED: "#ef4444",
  DORMANT: "#71717a",
  CONFIRMED: "#14b8a6",
  PENDING: "#f59e0b",
  FAILED: "#ef4444",
  REFUNDED: "#6366f1",
  AVAILABLE: "#14b8a6",
  IN_USE: "#3b82f6",
  MAINTENANCE: "#f59e0b",
  BROKEN: "#ef4444",
  RETIRED: "#71717a",
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

export async function getAnalyticsOverview(from?: string | null, to?: string | null): Promise<AnalyticsOverview> {
  const { data } = await httpClient.get<OverviewResponse>("/analytics/overview", {
    params: { from: from ?? undefined, to: to ?? undefined },
  });
  const charts = data.charts;
  return {
    stats: data.stats.map(toStatCardData),
    charts: {
      revenueTrend: charts.revenueTrend ?? [],
      harvestYield: charts.harvestYield ?? [],
      cropStatus: withColors(charts.cropStatus ?? []),
      revenueByFarm: charts.revenueByFarm ?? [],
      paymentStatus: withColors(charts.paymentStatus ?? []),
      equipmentStatus: withColors(charts.equipmentStatus ?? []),
    },
  };
}
