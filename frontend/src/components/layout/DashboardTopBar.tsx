import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faChevronDown,
  faUserGear,
  faRightFromBracket,
  faArrowRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { ThemeSwitcher } from "../common/ThemeSwitcher";
import { formatGreeting, formatFormattedDate } from "../../utils/greeting";
import type { UserProfile } from "../../types/user";

interface DashboardTopBarProps {
  user?: UserProfile;
  onOpenMobileSidebar: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

function formatRouteTitle(pathname: string): string {
  const segments = pathname.replace(/^\//, "").split("/");
  const last = segments[segments.length - 1] || "dashboard";
  return last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function UserAvatar({ name }: { name?: string }) {
  if (!name) return null;
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
  return (
    <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center text-white text-[11px] font-black shrink-0">
      {initials}
    </div>
  );
}

export function DashboardTopBar({
  user,
  onOpenMobileSidebar,
  onRefresh,
  isRefreshing = false,
}: DashboardTopBarProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    localStorage.removeItem("agrify_auth_token");
    navigate("/auth");
  };

  const border = isDark ? "border-zinc-800" : "border-zinc-200";
  const bg = isDark ? "bg-zinc-950/95" : "bg-white/95";
  const iconBtn = isDark
    ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900";

  const fullName = user
    ? `${user.firstName} ${user.lastName}`
    : "Farm User";

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b ${border} ${bg}`}
    >
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left: mobile menu + breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            aria-label="Open menu"
            className={`md:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${iconBtn}`}
          >
            <FontAwesomeIcon icon={faBars} className="w-4 h-4" />
          </button>

          <div className="hidden md:block min-w-0">
            <h1
              className={`text-sm font-extrabold uppercase tracking-wider truncate ${
                isDark ? "text-zinc-100" : "text-zinc-900"
              }`}
            >
              {formatRouteTitle(location.pathname)}
            </h1>
            <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 -mt-0.5">
              {formatFormattedDate()}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Refresh button */}
          {/* {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              aria-label="Refresh dashboard data"
              title="Refresh"
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${iconBtn}`}
            >
              <FontAwesomeIcon
                icon={faArrowRotateRight}
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
          )} */}

          {/* Notifications (placeholder) */}
          <button
            type="button"
            aria-label="Notifications"
            className={`relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${iconBtn}`}
          >
            <FontAwesomeIcon icon={faBell} className="w-4 h-4" />
            <span
              className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500 ring-2 ${
                isDark ? "ring-zinc-950" : "ring-white"
              }`}
            />
          </button>

          {/* User menu */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((p) => !p)}
              className={`flex items-center gap-2 pl-1 pr-2.5 h-9 rounded-xl transition-colors ${
                isDark ? "hover:bg-zinc-800" : "hover:bg-zinc-100"
              }`}
            >
              <UserAvatar name={fullName} />
              <div className="hidden sm:block text-left max-w-[110px]">
                <p
                  className={`text-xs font-bold truncate leading-tight ${
                    isDark ? "text-zinc-100" : "text-zinc-900"
                  }`}
                >
                  {user?.firstName ?? "User"}
                </p>
                <p className="text-[10px] text-zinc-400 truncate leading-tight">
                  {user?.role ?? "WORKER"}
                </p>
              </div>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`w-2.5 h-2.5 transition-transform duration-200 ${
                  menuOpen ? "rotate-180" : ""
                } text-zinc-400`}
              />
            </button>

            {menuOpen && (
              <div
                className={`absolute right-0 top-[calc(100%+8px)] w-56 rounded-2xl overflow-hidden shadow-xl border z-50 ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800"
                    : "bg-white border-zinc-200"
                }`}
              >
                {/* User info */}
                <div className={`px-4 py-3 border-b ${border}`}>
                  <p
                    className={`text-sm font-bold truncate ${
                      isDark ? "text-white" : "text-zinc-900"
                    }`}
                  >
                    {fullName}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5 truncate">
                    {user?.email}
                  </p>
                  <span className="inline-flex mt-1.5 items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                    {user?.role ?? "WORKER"}
                  </span>
                </div>

                {/* Theme switcher */}
                <div className={`px-4 py-3 border-b ${border}`}>
                  <p
                    className={`pb-2 text-[11px] font-bold uppercase tracking-widest ${
                      isDark ? "text-zinc-500" : "text-zinc-400"
                    }`}
                  >
                    Preferences
                  </p>
                  <ThemeSwitcher />
                </div>

                {/* Actions */}
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-bold transition-colors ${
                      isDark
                        ? "text-zinc-300 hover:bg-zinc-800"
                        : "text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={faUserGear}
                      className="w-3.5 h-3.5 opacity-60"
                    />
                    Profile & Settings
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-bold transition-colors text-red-500 ${
                      isDark ? "hover:bg-red-950/40" : "hover:bg-red-50"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={faRightFromBracket}
                      className="w-3.5 h-3.5"
                    />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile greeting bar */}
      <div className={`md:hidden px-4 pb-3 border-t ${border}`}>
        <p
          className={`text-xs font-bold pt-2 ${
            isDark ? "text-zinc-300" : "text-zinc-700"
          }`}
        >
          {formatGreeting(user?.firstName)} 👋
        </p>
        <p className="text-[11px] text-zinc-500">{formatFormattedDate()}</p>
      </div>
    </header>
  );
}
