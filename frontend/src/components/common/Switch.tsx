import { useTheme } from "../../contexts/ThemeContext";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

export function Switch({ checked, onChange, label, description }: SwitchProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className={`text-xs font-bold ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>{label}</p>
        {description && <p className={`text-[11px] mt-0.5 ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${
          checked ? "bg-teal-600" : isDark ? "bg-zinc-700" : "bg-zinc-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
