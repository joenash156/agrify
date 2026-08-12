import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/ThemeContext";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Hide the action button entirely — e.g. for view-only roles. */
  showAction?: boolean;
}

export function PageHeader({ title, subtitle, actionLabel, onAction, showAction = true }: PageHeaderProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const subText = isDark ? "text-zinc-500" : "text-zinc-500";

  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${sectionTitle}`}>{title}</h2>
        <p className={`text-xs sm:text-sm mt-0.5 font-medium ${subText}`}>{subtitle}</p>
      </div>
      {showAction && actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-[0.98] transition-all shadow-sm"
        >
          <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
