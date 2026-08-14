import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Modal } from "./Modal";
import { extractErrorMessage } from "../../utils/errors";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void>;
  danger?: boolean;
}

/** Reusable confirmation modal — used for every delete action across the app. */
export function ConfirmDialog({
  isOpen,
  onClose,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  danger = true,
}: ConfirmDialogProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err, "Something went wrong. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const subText = isDark ? "text-zinc-400" : "text-zinc-600";
  const cancelBtn = isDark
    ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
    : "border-zinc-200 text-zinc-700 hover:bg-zinc-100";
  const confirmBtn = danger
    ? "bg-red-600 hover:bg-red-700 text-white"
    : "bg-teal-600 hover:bg-teal-700 text-white";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
      <p className={`text-sm ${subText}`}>{message}</p>

      {error && (
        <div
          className={`mt-3 p-3 rounded-xl border text-xs font-semibold ${
            isDark ? "bg-red-950/40 border-red-800 text-red-400" : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {error}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 mt-5">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors disabled:opacity-50 ${cancelBtn}`}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 ${confirmBtn}`}
        >
          {isSubmitting ? "Working..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
