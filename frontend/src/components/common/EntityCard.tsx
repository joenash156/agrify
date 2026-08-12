import type { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useTheme } from "../../contexts/ThemeContext";
import { RowActions } from "./RowActions";

export interface EntityCardField {
  label: string;
  value: ReactNode;
}

interface EntityCardProps {
  icon: IconDefinition;
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  fields: EntityCardField[];
  canManage: boolean;
  entityLabel: string;
  onView?: () => void;
}

/**
 * Reusable mobile replacement for table rows — used across every list page
 * so records stay scannable on small screens instead of a squeezed table.
 */
export function EntityCard({
  icon,
  title,
  subtitle,
  badge,
  fields,
  canManage,
  entityLabel,
  onView,
}: EntityCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const sectionTitle = isDark ? "text-zinc-100" : "text-zinc-900";
  const subText = isDark ? "text-zinc-500" : "text-zinc-500";
  const iconWrap = isDark ? "bg-teal-500/10 text-teal-400" : "bg-teal-50 text-teal-600";
  const divider = isDark ? "border-zinc-800" : "border-zinc-100";

  return (
    <div className={`rounded-2xl border p-4 space-y-3 ${cardBg}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconWrap}`}>
            <FontAwesomeIcon icon={icon} className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className={`text-sm font-bold truncate ${sectionTitle}`}>{title}</p>
            {subtitle && <p className={`text-[11px] truncate ${subText}`}>{subtitle}</p>}
          </div>
        </div>
        {badge && <div className="shrink-0">{badge}</div>}
      </div>

      <div className={`grid grid-cols-2 gap-x-3 gap-y-2.5 pt-3 border-t ${divider}`}>
        {fields.map((field) => (
          <div key={field.label} className="min-w-0">
            <p className={`text-[10px] font-extrabold uppercase tracking-widest ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
              {field.label}
            </p>
            <p className={`text-xs font-semibold truncate mt-0.5 ${sectionTitle}`}>{field.value}</p>
          </div>
        ))}
      </div>

      <div className={`flex items-center justify-end pt-2 border-t ${divider}`}>
        <RowActions canManage={canManage} entityLabel={entityLabel} onView={onView} />
      </div>
    </div>
  );
}
