import { useState } from "react";
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
import { StatCard } from "../../components/dashboard/StatCard";
import { formatGreeting } from "../../utils/greeting";
import {
  MOCK_USER,
  getDashboardStats,
  HARVEST_CHART_DATA,
  SALES_CHART_DATA,
  CROP_STATUS_DATA,
  RECENT_SALES,
  UPCOMING_HARVESTS,
} from "../../data/dashboardMockData";

function SaleStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Paid:    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    Overdue: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${map[status] ?? map["Pending"]}`}>
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const user = MOCK_USER;
  const stats = getDashboardStats(user.role);
  const isAdmin = user.role === "ADMIN" || user.role === "FARM_MANAGER";

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call — replace with actual service call on integration
    setTimeout(() => setIsRefreshing(false), 1200);
  };

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
              ? `Here's what's happening across your ${user.farmName ?? "farms"} today.`
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

      {/* ── Admin Charts Section ── */}
      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue Area Chart — 2/3 width */}
          <div className={`lg:col-span-2 p-5 rounded-2xl border ${cardBg}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className={`text-sm font-extrabold ${sectionTitle}`}>Monthly Revenue</h3>
                <p className={`text-xs ${subText}`}>Last 6 months sales trend</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 ${isDark ? "text-teal-400" : "text-teal-600"}`}>
                ₵ 24,800 this month
              </span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={SALES_CHART_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={chartGrid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: chartText, fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: chartText, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₵${v / 1000}k`} />
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
                  data={CROP_STATUS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {CROP_STATUS_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: isDark ? "#18181b" : "#fff", border: `1px solid ${isDark ? "#3f3f46" : "#e4e4e7"}`, borderRadius: 12, fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {CROP_STATUS_DATA.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCircle} className="w-2 h-2" style={{ color: d.color }} />
                    <span className={`text-xs font-semibold ${subText}`}>{d.name}</span>
                  </div>
                  <span className={`text-xs font-bold ${sectionTitle}`}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Harvest Yield Bar Chart — full width */}
          <div className={`lg:col-span-3 p-5 rounded-2xl border ${cardBg}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className={`text-sm font-extrabold ${sectionTitle}`}>Harvest Yield (kg)</h3>
                <p className={`text-xs ${subText}`}>Monthly total yield across all farms</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={HARVEST_CHART_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
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
            {RECENT_SALES.map((sale) => (
              <div key={sale.id} className={`flex items-center justify-between px-5 py-3 gap-4 transition-colors ${isDark ? "hover:bg-zinc-800/50" : "hover:bg-zinc-100"}`}>
                <div className="min-w-0">
                  <p className={`text-xs font-bold truncate ${sectionTitle}`}>{sale.customer}</p>
                  <p className={`text-[11px] ${subText}`}>{sale.id} · {sale.items} item{sale.items > 1 ? "s" : ""} · {sale.date}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-black ${sectionTitle}`}>{sale.amount}</span>
                  <SaleStatusBadge status={sale.status} />
                </div>
              </div>
            ))}
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
            {UPCOMING_HARVESTS.map((h, i) => (
              <div key={i} className={`flex items-center justify-between px-5 py-3 gap-4 ${isDark ? "hover:bg-zinc-800/50" : "hover:bg-zinc-100"} transition-colors`}>
                <div className="flex items-center gap-3 min-w-0">
                  {h.daysLeft <= 5 && (
                    <FontAwesomeIcon icon={faWarning} className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${sectionTitle}`}>{h.crop} <span className="font-normal text-zinc-400">({h.variety})</span></p>
                    <p className={`text-[11px] ${subText}`}>{h.farm} · {h.quantity} est.</p>
                  </div>
                </div>
                <HarvestUrgencyBadge days={h.daysLeft} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
