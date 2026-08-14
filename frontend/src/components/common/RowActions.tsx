import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
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
  /** Override the edit action's label/icon — e.g. "Activate" for a pending account with no record yet. */
  editLabel?: string;
  editIcon?: IconDefinition;
  /** Override the destructive action's label/icon — e.g. "Void" for sales, which are soft-deleted. */
  deleteLabel?: string;
  deleteIcon?: IconDefinition;
}

export function RowActions({ canManage, entityLabel, onView, onEdit, onDelete, editLabel = "Edit", editIcon = faPen, deleteLabel = "Delete", deleteIcon = faTrash }: RowActionsProps) {
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
          title={editLabel}
          aria-label={`${editLabel} ${entityLabel}`}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${iconBtn}`}
        >
          <FontAwesomeIcon icon={editIcon} className="w-3.5 h-3.5" />
        </button>
      )}
      {canManage && onDelete && (
        <button
          type="button"
          onClick={onDelete}
          title={deleteLabel}
          aria-label={`${deleteLabel} ${entityLabel}`}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${deleteBtn}`}
        >
          <FontAwesomeIcon icon={deleteIcon} className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
