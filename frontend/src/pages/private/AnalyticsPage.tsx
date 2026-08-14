import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faDownload } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { StatCard } from "../../components/dashboard/StatCard";
import { PageHeader } from "../../components/common/PageHeader";
import { DateRangeFilter, type DateRange } from "../../components/common/DateRangeFilter";
import { downloadCsv } from "../../utils/exportCsv";
import { getAnalyticsOverview, type AnalyticsOverview } from "../../services/analyticsService";

type ChartRow = Record<string, string | number>;

function legendList(data: ChartRow[], sectionTitle: string, subText: string) {
  return (
    <div className="space-y-1.5 mt-2">
      {data.map((d) => (
        <div key={String(d.name)} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCircle} className="w-2 h-2" style={{ color: String(d.color) }} />
            <span className={`text-xs font-semibold ${subText}`}>{d.name}</span>
          </div>
          <span className={`text-xs font-bold ${sectionTitle}`}>{d.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [range, setRange] = useState<DateRange>({ preset: "ALL", from: null, to: null });

  useEffect(() => {
    getAnalyticsOverview(range.from, range.to)
      .then(setOverview)
      .catch(() => setOverview(null));
  }, [range]);

  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const subText = isDark ? "text-zinc-500" : "text-zinc-500";
  const chartGrid = isDark ? "#27272a" : "#f4f4f5";
  const chartText = isDark ? "#a1a1aa" : "#71717a";
  const tooltipStyle = {
    background: isDark ? "#18181b" : "#fff",
    border: `1px solid ${isDark ? "#3f3f46" : "#e4e4e7"}`,
    borderRadius: 12,
    fontSize: 11,
  };

  const stats = overview?.stats ?? [];
  const charts = overview?.charts;

  const handleDownload = () => {
    if (!overview) return;
    const { charts: c, stats: s } = overview;
    const rows: (string | number)[][] = [["Section", "Label", "Value"]];

    rows.push(["Summary", "", ""]);
    s.forEach((stat) => rows.push(["Summary", stat.title, stat.value]));

    rows.push(["Monthly Revenue", "Month", "Revenue (GHS)"]);
    c.revenueTrend.forEach((d) => rows.push(["Monthly Revenue", d.month, d.revenue]));

    rows.push(["Harvest Yield", "Month", "Yield (kg)"]);
    c.harvestYield.forEach((d) => rows.push(["Harvest Yield", d.month, d.yield]));

    rows.push(["Crop Status", "Status", "Count"]);
    c.cropStatus.forEach((d) => rows.push(["Crop Status", d.name, d.value]));

    rows.push(["Revenue by Farm", "Farm", "Revenue (GHS)"]);
    c.revenueByFarm.forEach((d) => rows.push(["Revenue by Farm", d.farm, d.revenue]));

    rows.push(["Payment Status", "Status", "Count"]);
    c.paymentStatus.forEach((d) => rows.push(["Payment Status", d.name, d.value]));

    rows.push(["Equipment Status", "Status", "Count"]);
    c.equipmentStatus.forEach((d) => rows.push(["Equipment Status", d.name, d.value]));

    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(`agrify-analytics-report-${date}.csv`, rows);
  };

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="A broader overview of performance across every farm."
        actionLabel="Download Report (CSV)"
        actionIcon={faDownload}
        showAction={Boolean(overview)}
        onAction={handleDownload}
      />

      <DateRangeFilter value={range} onChange={setRange} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {charts && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue trend — 2/3 */}
          <div className={`lg:col-span-2 p-5 rounded-2xl border ${cardBg}`}>
            <div className="mb-4">
              <h3 className={`text-sm font-extrabold ${sectionTitle}`}>Monthly Revenue</h3>
              <p className={`text-xs ${subText}`}>Full-year sales trend across all farms</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={charts.revenueTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="analyticsRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={chartGrid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: chartText, fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: chartText, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₵${Number(v) / 1000}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`₵ ${Number(v).toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2.5} fill="url(#analyticsRevenueGrad)" dot={{ fill: "#14b8a6", r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Crop status — 1/3 */}
          <div className={`p-5 rounded-2xl border ${cardBg}`}>
            <div className="mb-4">
              <h3 className={`text-sm font-extrabold ${sectionTitle}`}>Crop Status</h3>
              <p className={`text-xs ${subText}`}>Current cultivation breakdown</p>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={charts.cropStatus} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {charts.cropStatus.map((entry, i) => (
                    <Cell key={i} fill={String(entry.color)} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            {legendList(charts.cropStatus, sectionTitle, subText)}
          </div>

          {/* Harvest yield — full width */}
          <div className={`lg:col-span-3 p-5 rounded-2xl border ${cardBg}`}>
            <div className="mb-4">
              <h3 className={`text-sm font-extrabold ${sectionTitle}`}>Harvest Yield (kg)</h3>
              <p className={`text-xs ${subText}`}>Monthly total yield across all farms</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={charts.harvestYield} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid stroke={chartGrid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: chartText, fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: chartText, fontSize: 11 }} axisLine={false} tickLine={false} unit=" kg" />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} kg`, "Yield"]} />
                <Bar dataKey="yield" fill="#14b8a6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue by farm — 1/2 */}
          <div className={`lg:col-span-2 p-5 rounded-2xl border ${cardBg}`}>
            <div className="mb-4">
              <h3 className={`text-sm font-extrabold ${sectionTitle}`}>Revenue by Farm</h3>
              <p className={`text-xs ${subText}`}>Revenue per farm, this year</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={charts.revenueByFarm} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
                <CartesianGrid stroke={chartGrid} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fill: chartText, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₵${Number(v) / 1000}k`} />
                <YAxis type="category" dataKey="farm" tick={{ fill: chartText, fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`₵ ${Number(v).toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#14b8a6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Payment status — 1/3 */}
          <div className={`p-5 rounded-2xl border ${cardBg}`}>
            <div className="mb-4">
              <h3 className={`text-sm font-extrabold ${sectionTitle}`}>Payment Status</h3>
              <p className={`text-xs ${subText}`}>All payments on record</p>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={charts.paymentStatus} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {charts.paymentStatus.map((entry, i) => (
                    <Cell key={i} fill={String(entry.color)} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            {legendList(charts.paymentStatus, sectionTitle, subText)}
          </div>

          {/* Equipment status — full width */}
          <div className={`lg:col-span-3 p-5 rounded-2xl border ${cardBg}`}>
            <div className="mb-4">
              <h3 className={`text-sm font-extrabold ${sectionTitle}`}>Equipment Status</h3>
              <p className={`text-xs ${subText}`}>Operational health of all registered equipment</p>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={charts.equipmentStatus} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid stroke={chartGrid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: chartText, fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: chartText, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {charts.equipmentStatus.map((entry, i) => (
                    <Cell key={i} fill={String(entry.color)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
}
