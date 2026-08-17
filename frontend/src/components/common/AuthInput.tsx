import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { AuthInputProps } from "../../types/auth";

export function AuthInput({
  icon,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  isDark,
  right,
  autoComplete,
  required = false,
  disabled = false,
}: AuthInputProps) {
  return (
    <div
      className={[
        "flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all duration-150 shadow-xs",
        disabled ? "opacity-60 cursor-not-allowed" : "",
        isDark
          ? "bg-zinc-800/80 border-zinc-700 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20"
          : "bg-white border-zinc-300 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/15",
      ].join(" ")}
    >
      <FontAwesomeIcon
        icon={icon}
        className={`w-4 h-4 shrink-0 transition-colors ${
          isDark ? "text-zinc-400" : "text-zinc-600"
        }`}
      />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        className={[
          "flex-1 bg-transparent text-sm outline-none min-w-0 font-medium disabled:cursor-not-allowed",
          isDark
            ? "text-zinc-50 placeholder-zinc-400"
            : "text-zinc-900 placeholder-zinc-500",
        ].join(" ")}
      />
      {right}
    </div>
  );
}
