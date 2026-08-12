import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/ThemeContext";

interface ListToolbarProps<T extends string> {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  filters: readonly T[];
  activeFilter: T;
  onFilterChange: (filter: T) => void;
  formatLabel?: (filter: T) => string;
}

function defaultFormatLabel(filter: string): string {
  if (filter === "ALL") return "All";
  return filter.charAt(0) + filter.slice(1).toLowerCase().replace(/_/g, " ");
}

/** Shared search + status-filter bar used across every list page. */
export function ListToolbar<T extends string>({
  search,
  onSearchChange,
  searchPlaceholder,
  filters,
  activeFilter,
  onFilterChange,
  formatLabel = defaultFormatLabel,
}: ListToolbarProps<T>) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const inputBg = isDark
    ? "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600"
    : "bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400";

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[220px]">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium border outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors ${inputBg}`}
        />
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={`px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wide border transition-colors ${
              activeFilter === filter
                ? "bg-teal-600 border-teal-600 text-white"
                : isDark
                ? "border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            {formatLabel(filter)}
          </button>
        ))}
      </div>
    </div>
  );
}
