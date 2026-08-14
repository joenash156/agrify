import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleExclamation, faCircleInfo, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/ThemeContext";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

const ICON_BY_TYPE = {
  success: faCircleCheck,
  error: faCircleExclamation,
  info: faCircleInfo,
};

interface ToastViewportProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

/** Fixed top-right stack — the visual half of the app-wide toast system (see ToastContext for the API). */
export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const styleByType: Record<ToastType, string> = {
    success: isDark
      ? "border-teal-500/30 bg-zinc-900 text-teal-400"
      : "border-teal-500/25 bg-white text-teal-600",
    error: isDark
      ? "border-red-500/30 bg-zinc-900 text-red-400"
      : "border-red-500/25 bg-white text-red-600",
    info: isDark
      ? "border-blue-500/30 bg-zinc-900 text-blue-400"
      : "border-blue-500/25 bg-white text-blue-600",
  };
  const textColor = isDark ? "text-zinc-100" : "text-zinc-900";
  const closeBtn = isDark
    ? "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
    : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100";

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[min(360px,calc(100vw-2rem))] pointer-events-none">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-lg backdrop-blur-sm ${styleByType[t.type]}`}
          >
            <FontAwesomeIcon icon={ICON_BY_TYPE[t.type]} className="w-4 h-4 mt-0.5 shrink-0" />
            <p className={`text-xs font-semibold flex-1 min-w-0 ${textColor}`}>{t.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss notification"
              className={`w-6 h-6 shrink-0 flex items-center justify-center rounded-lg transition-colors ${closeBtn}`}
            >
              <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
