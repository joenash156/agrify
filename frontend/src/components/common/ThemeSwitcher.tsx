import { useTheme } from "../../contexts/ThemeContext";
import { SunIcon, MoonIcon, SystemIcon } from "../icons/AnimatedIcons";
import type { ThemePreference } from "../../types/theme";

export function ThemeSwitcher() {
  const { theme, preference, setTheme } = useTheme();
  const isDark = theme === "dark";

  const options: { id: ThemePreference; label: string; icon: React.ReactNode }[] = [
    {
      id: "light",
      label: "Light",
      icon: <SunIcon width={16} height={16} />,
    },
    {
      id: "dark",
      label: "Dark",
      icon: <MoonIcon width={16} height={16} />,
    },
    {
      id: "system",
      label: "System",
      icon: <SystemIcon width={16} height={16} />,
    },
  ];

  return (
    <div
      className={`grid grid-cols-3 gap-1 p-1 rounded-xl border ${
        isDark ? "bg-zinc-900 border-zinc-700/80" : "bg-zinc-100 border-zinc-200"
      }`}
    >
      {options.map((opt) => {
        const isActive = preference === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setTheme(opt.id)}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              isActive
                ? isDark
                  ? "bg-zinc-800 text-white shadow-xs border border-zinc-700"
                  : "bg-white text-zinc-900 shadow-xs border border-zinc-200"
                : isDark
                ? "text-zinc-400 hover:text-zinc-200"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {opt.icon}
            <span className="text-[11px]">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
