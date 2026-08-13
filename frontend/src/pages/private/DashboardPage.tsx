import { useCallback, useEffect, useState } from "react";
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
import {
  faArrowRotateRight,
  faChevronRight,
  faCircle,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useCurrentUser } from "../../contexts/AuthContext";
import { StatCard } from "../../components/dashboard/StatCard";
import { formatGreeting } from "../../utils/greeting";
import { formatDate } from "../../utils/formatDate";
import { getDashboardOverview, type DashboardOverview } from "../../services/dashboardService";
import { saleService } from "../../services/saleService";
import { cropService } from "../../services/cropService";
import { farmService } from "../../services/farmService";

interface RecentSaleRow {
  id: string;
  customer: string;
  items: number;
  amount: string;
  status: string;
  date: string;
}

interface UpcomingHarvestRow {
  crop: string;
  variety: string;
  farm: string;
  daysLeft: number;
}

const SALE_STATUS_LABEL: Record<string, string> = {
  PAID: "Paid",
  PARTIALLY_PAID: "Partially Paid",
  UNPAID: "Unpaid",
  CANCELLED: "Cancelled",
};

function SaleStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Paid:            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    "Partially Paid": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    Unpaid:          "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
    Cancelled:       "bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border border-zinc-500/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${map[status] ?? map["Partially Paid"]}`}>
      {status}
    </span>
  );
}

function HarvestUrgencyBadge({ days }: { days: number }) {
  if (days <= 5) return <span className="text-[10px] font-bold text-red-500">{days}d</span>;
  if (days <= 14) return <span className="text-[10px] font-bold text-amber-500">{days}d</span>;
  return <span className="text-[10px] font-bold text-zinc-400">{days}d</span>;
}

export default function DashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const user = useCurrentUser();
  const isAdmin = user.role === "ADMIN" || user.role === "FARM_MANAGER";

  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recentSales, setRecentSales] = useState<RecentSaleRow[]>([]);
  const [upcomingHarvests, setUpcomingHarvests] = useState<UpcomingHarvestRow[]>([]);

  const fetchOverview = useCallback(() => {
    return getDashboardOverview()
      .then(setOverview)
      .catch(() => setOverview(null));
  }, []);

  const fetchWidgets = useCallback(() => {
    return Promise.all([saleService.findAll(), cropService.findAll(), farmService.findAll()])
      .then(([sales, crops, farms]) => {
        const farmNameById = new Map(farms.map((f) => [f.farmId, f.farmName]));

        const sortedSales = [...sales].sort(
          (a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()
        );
        setRecentSales(
          sortedSales.slice(0, 5).map((sale) => ({
            id: sale.saleId,
            customer: sale.customerName,
            items: sale.itemCount,
            amount: `₵ ${sale.total.toLocaleString()}`,
            status: SALE_STATUS_LABEL[sale.saleStatus] ?? sale.saleStatus,
            date: formatDate(sale.saleDate),
          }))
        );

        const today = new Date();
        const upcoming = crops
          .filter((c) => c.cropStatus === "GROWING" || c.cropStatus === "READY")
          .map((c) => ({
            crop: c.cropName,
            variety: c.cropVariety,
            farm: farmNameById.get(c.farmId) ?? "Unknown Farm",
            daysLeft: Math.ceil(
              (new Date(c.expectedHarvestDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            ),
          }))
          .filter((c) => c.daysLeft >= 0)
          .sort((a, b) => a.daysLeft - b.daysLeft);
        setUpcomingHarvests(upcoming.slice(0, 4));
      })
      .catch(() => {
        setRecentSales([]);
        setUpcomingHarvests([]);
      });
  }, []);

  useEffect(() => {
    fetchOverview();
    fetchWidgets();
  }, [fetchOverview, fetchWidgets]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    Promise.all([fetchOverview(), fetchWidgets()]).finally(() => setIsRefreshing(false));
  };

  const stats = overview?.stats ?? [];
  const charts = overview?.charts;

  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const subText = isDark ? "text-zinc-500" : "text-zinc-500";
  const chartGrid = isDark ? "#27272a" : "#f4f4f5";
  const chartText = isDark ? "#a1a1aa" : "#71717a";

  return (
    <>
      {/* ── Greeting banner ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${sectionTitle}`}>
            {formatGreeting(user.firstName)}
          </h2>
          <p className={`text-xs sm:text-sm mt-0.5 font-medium ${subText}`}>
            {isAdmin
              ? "Here's what's happening across your farms today."
              : "Here's your work summary for today."}
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
            isDark
              ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              : "border-zinc-200 text-zinc-700 hover:bg-zinc-100"
          }`}
        >
          <FontAwesomeIcon
            icon={faArrowRotateRight}
            className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* ── Stat Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* ── Charts Section — tailored per role ── */}
      {isAdmin && charts && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue Area Chart — 2/3 width */}
          <div className={`lg:col-span-2 p-5 rounded-2xl border ${cardBg}`}>
            <div className="mb-4">
              <h3 className={`text-sm font-extrabold ${sectionTitle}`}>Monthly Revenue</h3>
              <p className={`text-xs ${subText}`}>Last 6 months sales trend</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={charts.salesChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={chartGrid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: chartText, fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: chartText, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₵${Number(v) / 1000}k`} />
                <Tooltip
                  contentStyle={{ background: isDark ? "#18181b" : "#fff", border: `1px solid ${isDark ? "#3f3f46" : "#e4e4e7"}`, borderRadius: 12, fontSize: 11 }}
                  formatter={(v) => [`₵ ${Number(v).toLocaleString()}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ fill: "#14b8a6", r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Crop Status Pie — 1/3 width */}
          <div className={`p-5 rounded-2xl border ${cardBg}`}>
            <div className="mb-4">
              <h3 className={`text-sm font-extrabold ${sectionTitle}`}>Crop Status</h3>
              <p className={`text-xs ${subText}`}>Current cultivation breakdown</p>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={charts.cropStatusChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {charts.cropStatusChart.map((entry, i) => (
                    <Cell key={i} fill={String(entry.color)} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: isDark ? "#18181b" : "#fff", border: `1px solid ${isDark ? "#3f3f46" : "#e4e4e7"}`, borderRadius: 12, fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {charts.cropStatusChart.map((d) => (
                <div key={String(d.name)} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCircle} className="w-2 h-2" style={{ color: String(d.color) }} />
                    <span className={`text-xs font-semibold ${subText}`}>{d.name}</span>
                  </div>
                  <span className={`text-xs font-bold ${sectionTitle}`}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Harvest Yield Bar Chart — full width */}
          <div className={`lg:col-span-3 p-5 rounded-2xl border ${cardBg}`}>
            <div className="mb-4">
              <h3 className={`text-sm font-extrabold ${sectionTitle}`}>Harvest Yield (kg)</h3>
              <p className={`text-xs ${subText}`}>Monthly total yield across all farms</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={charts.harvestChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid stroke={chartGrid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: chartText, fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: chartText, fontSize: 11 }} axisLine={false} tickLine={false} unit=" kg" />
                <Tooltip
                  contentStyle={{ background: isDark ? "#18181b" : "#fff", border: `1px solid ${isDark ? "#3f3f46" : "#e4e4e7"}`, borderRadius: 12, fontSize: 11 }}
                  formatter={(v) => [`${v} kg`, "Yield"]}
                />
                <Bar dataKey="yield" fill="#14b8a6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {user.role === "SALES_PERSON" && charts && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* My Sales Trend — 2/3 width */}
          <div className={`lg:col-span-2 p-5 rounded-2xl border ${cardBg}`}>
            <div className="mb-4">
              <h3 className={`text-sm font-extrabold ${sectionTitle}`}>My Sales Trend</h3>
              <p className={`text-xs ${subText}`}>Last 6 months of your closed orders</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={charts.mySalesTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="mySalesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={chartGrid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: chartText, fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: chartText, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₵${Number(v) / 1000}k`} />
                <Tooltip
                  contentStyle={{ background: isDark ? "#18181b" : "#fff", border: `1px solid ${isDark ? "#3f3f46" : "#e4e4e7"}`, borderRadius: 12, fontSize: 11 }}
                  formatter={(v) => [`₵ ${Number(v).toLocaleString()}`, "My Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2.5} fill="url(#mySalesGrad)" dot={{ fill: "#14b8a6", r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* My Order Status Pie — 1/3 width */}
          <div className={`p-5 rounded-2xl border ${cardBg}`}>
            <div className="mb-4">
              <h3 className={`text-sm font-extrabold ${sectionTitle}`}>My Order Status</h3>
              <p className={`text-xs ${subText}`}>Breakdown of your orders</p>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={charts.myOrderStatus} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {charts.myOrderStatus.map((entry, i) => (
                    <Cell key={i} fill={String(entry.color)} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: isDark ? "#18181b" : "#fff", border: `1px solid ${isDark ? "#3f3f46" : "#e4e4e7"}`, borderRadius: 12, fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {charts.myOrderStatus.map((d) => (
                <div key={String(d.name)} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCircle} className="w-2 h-2" style={{ color: String(d.color) }} />
                    <span className={`text-xs font-semibold ${subText}`}>{d.name}</span>
                  </div>
                  <span className={`text-xs font-bold ${sectionTitle}`}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {user.role === "WORKER" && charts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* My Attendance Bar Chart */}
          <div className={`p-5 rounded-2xl border ${cardBg}`}>
            <div className="mb-4">
              <h3 className={`text-sm font-extrabold ${sectionTitle}`}>My Attendance</h3>
              <p className={`text-xs ${subText}`}>Last 30 days</p>
            </div>
            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={charts.myAttendance} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid stroke={chartGrid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="status" tick={{ fill: chartText, fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: chartText, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: isDark ? "#18181b" : "#fff", border: `1px solid ${isDark ? "#3f3f46" : "#e4e4e7"}`, borderRadius: 12, fontSize: 11 }}
                  formatter={(v) => [`${v} day${Number(v) === 1 ? "" : "s"}`, "Days"]}
                />
                <Bar dataKey="count" fill="#14b8a6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* My Crops Status Pie */}
          <div className={`p-5 rounded-2xl border ${cardBg}`}>
            <div className="mb-4">
              <h3 className={`text-sm font-extrabold ${sectionTitle}`}>Crops At My Farm</h3>
              <p className={`text-xs ${subText}`}>Status breakdown</p>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={charts.myCropsStatus} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {charts.myCropsStatus.map((entry, i) => (
                    <Cell key={i} fill={String(entry.color)} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: isDark ? "#18181b" : "#fff", border: `1px solid ${isDark ? "#3f3f46" : "#e4e4e7"}`, borderRadius: 12, fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {charts.myCropsStatus.map((d) => (
                <div key={String(d.name)} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCircle} className="w-2 h-2" style={{ color: String(d.color) }} />
                    <span className={`text-xs font-semibold ${subText}`}>{d.name}</span>
                  </div>
                  <span className={`text-xs font-bold ${sectionTitle}`}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom two-column section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Sales Table */}
        <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
          <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
            <div>
              <h3 className={`text-sm font-extrabold ${sectionTitle}`}>Recent Sales</h3>
              <p className={`text-xs ${subText}`}>Last 5 orders</p>
            </div>
            <button className="text-[11px] font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
              View all <FontAwesomeIcon icon={faChevronRight} className="w-2.5 h-2.5" />
            </button>
          </div>
          <div className={`divide-y ${isDark ? "divide-zinc-800" : "divide-zinc-100"}`}>
            {recentSales.map((sale) => (
              <div key={sale.id} className={`flex items-center justify-between px-5 py-3 gap-4 transition-colors ${isDark ? "hover:bg-zinc-800/50" : "hover:bg-zinc-100"}`}>
                <div className="min-w-0">
                  <p className={`text-xs font-bold truncate ${sectionTitle}`}>{sale.customer}</p>
                  <p className={`text-[11px] ${subText}`}>{sale.items} item{sale.items > 1 ? "s" : ""} · {sale.date}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-black ${sectionTitle}`}>{sale.amount}</span>
                  <SaleStatusBadge status={sale.status} />
                </div>
              </div>
            ))}
            {recentSales.length === 0 && (
              <p className={`px-5 py-6 text-center text-xs ${subText}`}>No sales recorded yet.</p>
            )}
          </div>
        </div>

        {/* Upcoming Harvests */}
        <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
          <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
            <div>
              <h3 className={`text-sm font-extrabold ${sectionTitle}`}>Upcoming Harvests</h3>
              <p className={`text-xs ${subText}`}>Crops due for harvest soon</p>
            </div>
            <button className="text-[11px] font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
              View all <FontAwesomeIcon icon={faChevronRight} className="w-2.5 h-2.5" />
            </button>
          </div>
          <div className={`divide-y ${isDark ? "divide-zinc-800" : "divide-zinc-100"}`}>
            {upcomingHarvests.map((h, i) => (
              <div key={i} className={`flex items-center justify-between px-5 py-3 gap-4 ${isDark ? "hover:bg-zinc-800/50" : "hover:bg-zinc-100"} transition-colors`}>
                <div className="flex items-center gap-3 min-w-0">
                  {h.daysLeft <= 5 && (
                    <FontAwesomeIcon icon={faWarning} className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${sectionTitle}`}>{h.crop} <span className="font-normal text-zinc-400">({h.variety})</span></p>
                    <p className={`text-[11px] ${subText}`}>{h.farm}</p>
                  </div>
                </div>
                <HarvestUrgencyBadge days={h.daysLeft} />
              </div>
            ))}
            {upcomingHarvests.length === 0 && (
              <p className={`px-5 py-6 text-center text-xs ${subText}`}>No upcoming harvests scheduled.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
