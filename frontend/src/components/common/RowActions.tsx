import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/ThemeContext";

interface RowActionsProps {
  /** Whether the current user can edit/delete — admins & farm managers only. Everyone can view. */
  canManage: boolean;
  /** Lowercase noun used in placeholder messaging, e.g. "farm", "crop", "sale". */
  entityLabel: string;
  onView?: () => void;
  /** Omit to hide the Edit action entirely (e.g. entities the backend doesn't support updating). */
  onEdit?: () => void;
  /** Omit to hide the Delete action entirely. */
  onDelete?: () => void;
}

export function RowActions({ canManage, entityLabel, onView, onEdit, onDelete }: RowActionsProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const iconBtn = isDark
    ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900";
  const deleteBtn = isDark
    ? "text-zinc-400 hover:bg-red-950/40 hover:text-red-400"
    : "text-zinc-500 hover:bg-red-50 hover:text-red-600";

  return (
    <div className="flex items-center justify-end gap-1">
      {onView && (
        <button
          type="button"
          onClick={onView}
          title="View"
          aria-label={`View ${entityLabel}`}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${iconBtn}`}
        >
          <FontAwesomeIcon icon={faEye} className="w-3.5 h-3.5" />
        </button>
      )}
      {canManage && onEdit && (
        <button
          type="button"
          onClick={onEdit}
          title="Edit"
          aria-label={`Edit ${entityLabel}`}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${iconBtn}`}
        >
          <FontAwesomeIcon icon={faPen} className="w-3.5 h-3.5" />
        </button>
      )}
      {canManage && onDelete && (
        <button
          type="button"
          onClick={onDelete}
          title="Delete"
          aria-label={`Delete ${entityLabel}`}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${deleteBtn}`}
        >
          <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
