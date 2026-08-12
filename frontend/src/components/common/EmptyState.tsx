import { useTheme } from "../../contexts/ThemeContext";

interface EmptyStateProps {
  title: string;
  subtitle?: string;
}

export function EmptyState({ title, subtitle = "Try adjusting your search or filter." }: EmptyStateProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="py-14 text-center">
      <p className={`text-sm font-bold ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>{title}</p>
      <p className={`text-xs mt-1 ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>{subtitle}</p>
    </div>
  );
}
