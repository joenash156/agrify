import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/ThemeContext";

interface RowActionsProps {
  /** Whether the current user can edit/delete — admins & farm managers only. Everyone can view. */
  canManage: boolean;
  /** Lowercase noun used in placeholder messaging, e.g. "farm", "crop", "sale". */
  entityLabel: string;
  onView?: () => void;
}

export function RowActions({ canManage, entityLabel, onView }: RowActionsProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const iconBtn = isDark
    ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900";
  const deleteBtn = isDark
    ? "text-zinc-400 hover:bg-red-950/40 hover:text-red-400"
    : "text-zinc-500 hover:bg-red-50 hover:text-red-600";

  const handleView =
    onView ?? (() => alert(`Viewing ${entityLabel} details will be available once the backend is connected.`));

  const handleEdit = () =>
    alert(`Editing this ${entityLabel} will be available once the backend is connected.`);

  const handleDelete = () => {
    if (confirm(`Delete this ${entityLabel}? This action will be enabled once the backend is connected.`)) {
      alert("Delete functionality will be available once the backend is connected.");
    }
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={handleView}
        title="View"
        aria-label={`View ${entityLabel}`}
        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${iconBtn}`}
      >
        <FontAwesomeIcon icon={faEye} className="w-3.5 h-3.5" />
      </button>
      {canManage && (
        <>
          <button
            type="button"
            onClick={handleEdit}
            title="Edit"
            aria-label={`Edit ${entityLabel}`}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${iconBtn}`}
          >
            <FontAwesomeIcon icon={faPen} className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            title="Delete"
            aria-label={`Delete ${entityLabel}`}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${deleteBtn}`}
          >
            <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  );
}
