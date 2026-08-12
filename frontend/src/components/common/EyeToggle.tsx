import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface EyeToggleProps {
  show: boolean;
  onToggle: () => void;
  isDark: boolean;
}

export function EyeToggle({ show, onToggle, isDark }: EyeToggleProps) {
  return (
    <button
      type="button"
      aria-label={show ? "Hide password" : "Show password"}
      onClick={onToggle}
      tabIndex={-1}
      className={`shrink-0 transition-colors duration-150 ${
        isDark ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-600 hover:text-zinc-900"
      }`}
    >
      <FontAwesomeIcon icon={show ? faEyeSlash : faEye} className="w-4 h-4" />
    </button>
  );
}
