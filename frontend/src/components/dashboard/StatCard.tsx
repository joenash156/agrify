import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendUp, faArrowTrendDown, faMinus } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/ThemeContext";
import type { StatCardData } from "../../types/dashboard";

interface StatCardProps extends StatCardData {
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  trend = "neutral",
  subtitle,
  icon,
  accentColor = "teal",
  className = "",
}: StatCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const trendIcon =
    trend === "up"
      ? faArrowTrendUp
      : trend === "down"
      ? faArrowTrendDown
      : faMinus;

  const trendColor =
    trend === "up"
      ? "text-emerald-500"
      : trend === "down"
      ? "text-red-500"
      : "text-zinc-400";

  const accentMap: Record<string, { icon: string; badge: string; border: string }> = {
    teal:   { icon: "bg-teal-500/10 text-teal-500",   badge: "bg-teal-500/10 text-teal-600 dark:text-teal-400",  border: "border-teal-500/15" },
    amber:  { icon: "bg-amber-500/10 text-amber-500", badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400", border: "border-amber-500/15" },
    blue:   { icon: "bg-blue-500/10 text-blue-500",   badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400",  border: "border-blue-500/15" },
    purple: { icon: "bg-purple-500/10 text-purple-500", badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400", border: "border-purple-500/15" },
    rose:   { icon: "bg-rose-500/10 text-rose-500",   badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400",  border: "border-rose-500/15" },
    orange: { icon: "bg-orange-500/10 text-orange-500", badge: "bg-orange-500/10 text-orange-600 dark:text-orange-400", border: "border-orange-500/15" },
  };

  const accent = accentMap[accentColor] ?? accentMap["teal"];

  return (
    <div
      className={[
        "group relative flex flex-col gap-4 p-5 rounded-2xl border transition-all duration-200",
        isDark
          ? `bg-zinc-900 border-zinc-800 hover:border-zinc-700`
          : `bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-sm`,
        className,
      ].join(" ")}
    >
      {/* Header row: title + icon */}
      <div className="flex items-start justify-between gap-2">
        <p
          className={`text-xs font-extrabold uppercase tracking-widest ${
            isDark ? "text-zinc-400" : "text-zinc-500"
          }`}
        >
          {title}
        </p>
        <div
          className={`w-9 h-9 flex items-center justify-center rounded-xl shrink-0 ${accent.icon}`}
        >
          <FontAwesomeIcon icon={icon} className="w-4 h-4" />
        </div>
      </div>

      {/* Value */}
      <div>
        <p
          className={`text-3xl font-black tracking-tight leading-none ${
            isDark ? "text-white" : "text-zinc-900"
          }`}
        >
          {value}
        </p>
        {subtitle && (
          <p
            className={`text-xs mt-1 font-medium ${
              isDark ? "text-zinc-500" : "text-zinc-500"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Trend badge */}
      {change && (
        <div className="flex items-center gap-1.5 mt-auto">
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
              trend === "up"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : trend === "down"
                ? "bg-red-500/10 text-red-600 dark:text-red-400"
                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
            }`}
          >
            <FontAwesomeIcon icon={trendIcon} className={`w-2.5 h-2.5 ${trendColor}`} />
            <span>{change}</span>
          </div>
          <span className={`text-[11px] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            vs last month
          </span>
        </div>
      )}
    </div>
  );
}
