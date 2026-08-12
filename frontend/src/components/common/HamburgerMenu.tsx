import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function HamburgerMenu() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative z-50">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-200 shadow-xs ${
          isDark
            ? "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-100"
            : "bg-white hover:bg-zinc-50 border-zinc-100 text-zinc-800"
        }`}
      >
        <div className="flex flex-col justify-center items-center w-5 h-5 space-y-1">
          <span
            className={`h-0.5 w-5 rounded-full transition-all duration-300 transform ${
              isDark ? "bg-zinc-100" : "bg-zinc-800"
            } ${open ? "rotate-45 translate-y-1.5" : ""}`}
          />
          <span
            className={`h-0.5 w-5 rounded-full transition-all duration-300 ${
              isDark ? "bg-zinc-100" : "bg-zinc-800"
            } ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-5 rounded-full transition-all duration-300 transform ${
              isDark ? "bg-zinc-100" : "bg-zinc-800"
            } ${open ? "-rotate-45 -translate-y-1.5" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute right-0 top-[calc(100%+8px)] w-60 rounded-2xl overflow-hidden shadow-xl border z-50 animate-in fade-in slide-in-from-top-2 duration-200 ${
            isDark
              ? "bg-zinc-900 border-zinc-800 text-zinc-100"
              : "bg-white border-zinc-200 text-zinc-900"
          }`}
        >
          <div className="px-4 py-3">
            <p
              className={`pb-2 text.xs font-bold uppercase tracking-wider ${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              Preferences
            </p>
            <ThemeSwitcher />
          </div>

          <div
            className={`h-px mx-4 ${isDark ? "bg-zinc-800" : "bg-zinc-100"}`}
          />

          <div className="p-2">
            <Link
              to="/"
              role="menuitem"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                isDark
                  ? "text-zinc-200 hover:bg-zinc-800"
                  : "text-zinc-800 hover:bg-zinc-100"
              }`}
            >
              <FontAwesomeIcon
                icon={faLeaf}
                className="w-3.5 h-3.5 text-teal-600"
              />
              <span>Back to Agrify</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
