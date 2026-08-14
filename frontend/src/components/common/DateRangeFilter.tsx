import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

export type RangePreset = "ALL" | "TODAY" | "WEEK" | "MONTH" | "CUSTOM";

export interface DateRange {
  preset: RangePreset;
  /** ISO date strings (YYYY-MM-DD). Both null means "All" — no filtering. */
  from: string | null;
  to: string | null;
}

const PRESETS: Array<{ value: RangePreset; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "TODAY", label: "Today" },
  { value: "WEEK", label: "This Week" },
  { value: "MONTH", label: "Last Month" },
  { value: "CUSTOM", label: "Custom" },
];

function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function rangeForPreset(preset: RangePreset): { from: string | null; to: string | null } {
  const now = new Date();
  if (preset === "ALL") return { from: null, to: null };
  if (preset === "TODAY") {
    const iso = toIso(now);
    return { from: iso, to: iso };
  }
  if (preset === "WEEK") {
    const day = now.getDay(); // 0 = Sunday
    const diffToMonday = day === 0 ? 6 : day - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday);
    return { from: toIso(monday), to: toIso(now) };
  }
  // MONTH — the previous calendar month, start to end.
  const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastOfPrevMonth = new Date(firstOfThisMonth.getTime() - 86400000);
  const firstOfPrevMonth = new Date(lastOfPrevMonth.getFullYear(), lastOfPrevMonth.getMonth(), 1);
  return { from: toIso(firstOfPrevMonth), to: toIso(lastOfPrevMonth) };
}

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

/** Preset date-range picker (All / Today / This Week / Last Month / Custom) shared by
 * the Dashboard and Analytics pages — every stat/chart on those pages is scoped to it. */
export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [customFrom, setCustomFrom] = useState(value.from ?? "");
  const [customTo, setCustomTo] = useState(value.to ?? "");

  const activeBtn = isDark ? "bg-teal-500/15 text-teal-400" : "bg-teal-600 text-white";
  const inactiveBtn = isDark
    ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900";
  const inputCls = `px-3 py-1.5 rounded-lg text-xs border outline-none ${
    isDark ? "bg-zinc-800/60 border-zinc-700 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"
  }`;

  const selectPreset = (preset: RangePreset) => {
    if (preset === "CUSTOM") {
      onChange({ preset, from: customFrom || null, to: customTo || null });
      return;
    }
    onChange({ preset, ...rangeForPreset(preset) });
  };

  const applyCustom = () => {
    if (customFrom && customTo) onChange({ preset: "CUSTOM", from: customFrom, to: customTo });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className={`flex items-center gap-1 p-1 rounded-xl border ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
        {PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => selectPreset(p.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              value.preset === p.value ? activeBtn : inactiveBtn
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {value.preset === "CUSTOM" && (
        <div className="flex items-center gap-2">
          <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className={inputCls} />
          <span className={isDark ? "text-zinc-600" : "text-zinc-400"}>to</span>
          <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className={inputCls} />
          <button
            type="button"
            onClick={applyCustom}
            disabled={!customFrom || !customTo}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 transition-colors"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}

export default DateRangeFilter;
