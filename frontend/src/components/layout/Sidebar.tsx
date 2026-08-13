import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faAnglesRight,
  faLeaf,
  faXmark,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { getNavGroups } from "../../data/dashboardNav";
import type { NavGroup } from "../../types/dashboard";
import type { UserRole } from "../../types/user";

interface SidebarProps {
  role?: UserRole;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Brand({ collapsed, isDark }: { collapsed: boolean; isDark: boolean }) {
  return (
    <Link
      to="/dashboard"
      className="flex items-center gap-3 px-4 h-16 shrink-0 overflow-hidden"
    >
      <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shrink-0 shadow-md shadow-teal-600/30">
        <FontAwesomeIcon icon={faLeaf} className="w-5 h-5 text-white" />
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-tight whitespace-nowrap text-white">
            Agrify
            <span className="text-teal-400 ml-0.5">.</span>
          </span>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest -mt-1 ${
              isDark ? "text-zinc-500" : "text-teal-100/40"
            }`}
          >
            Enterprise Farm
          </span>
        </div>
      )}
    </Link>
  );
}

function SidebarNav({
  groups,
  collapsed,
  isDark,
  onNavigate,
}: {
  groups: NavGroup[];
  collapsed: boolean;
  isDark: boolean;
  onNavigate?: () => void;
}) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className="flex-1 overflow-y-auto hide-scrollbar px-3 py-3 space-y-6">
      {groups.map((group) => (
        <div key={group.label}>
          {!collapsed && (
            <p
              className={`px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest ${
                isDark ? "text-zinc-500" : "text-teal-100/60"
              }`}
            >
              {group.label}
            </p>
          )}
          <div className="space-y-1">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  className={[
                    "relative flex items-center gap-3 h-10 rounded-xl text-xs font-bold transition-all duration-150",
                    collapsed ? "justify-center px-0 mx-auto w-10" : "px-3",
                    active
                      ? isDark
                        ? "bg-teal-500/15 text-teal-400 font-extrabold shadow-xs"
                        : "bg-white/15 text-white font-extrabold shadow-xs backdrop-blur-xs"
                      : isDark
                      ? "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100"
                      : "text-teal-100/80 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  {active && (
                    <span
                      className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${
                        isDark ? "bg-teal-400" : "bg-teal-300"
                      }`}
                    />
                  )}
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      active
                        ? isDark
                          ? "text-teal-400"
                          : "text-white"
                        : isDark
                        ? "text-zinc-500"
                        : "text-teal-200/70"
                    }`}
                  />
                  {!collapsed && (
                    <span className="whitespace-nowrap flex-1 truncate">
                      {item.label}
                    </span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function Sidebar({
  role = "ADMIN",
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const groups = getNavGroups(role);

  // Diagonal gradient styling — deep teal in light mode, dark zinc depth in dark mode.
  // Both are genuinely dark surfaces, so foreground colors below are tuned for a dark
  // background in either case rather than flipping to light-on-white text.
  const sidebarBg = isDark
    ? "bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-950 border-zinc-800/80"
    : "bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 border-teal-950/60";

  const rolePanel = isDark
    ? "border-teal-500/20 bg-teal-500/10"
    : "border-white/15 bg-white/10";
  const shieldIcon = isDark ? "text-teal-500" : "text-teal-200";
  const roleText = isDark ? "text-teal-400" : "text-teal-100";
  const roleSubText = isDark ? "text-zinc-400" : "text-teal-200/70";

  const collapseBorder = isDark ? "border-zinc-800/60" : "border-white/10";
  const collapseBtn = isDark
    ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
    : "text-teal-100/80 hover:bg-white/10 hover:text-white";

  const mobileCloseBtn = isDark
    ? "text-zinc-400 hover:bg-zinc-800"
    : "text-teal-100/80 hover:bg-white/10";

  return (
    <>
      {/* DESKTOP SIDEBAR RAIL */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ type: "spring", damping: 26, stiffness: 280 }}
        className={`hidden md:flex flex-col shrink-0 h-screen sticky top-0 border-r z-30 ${sidebarBg}`}
      >
        <Brand collapsed={collapsed} isDark={isDark} />

        {!collapsed && (
          <div className={`mx-3 my-2 p-3.5 rounded-2xl border backdrop-blur-xs flex items-center gap-3 ${rolePanel}`}>
            <FontAwesomeIcon
              icon={faShieldHalved}
              className={`w-4 h-4 shrink-0 ${shieldIcon}`}
            />
            <div className="min-w-0 flex-1">
              <p className={`text-[11px] font-bold truncate ${roleText}`}>
                Role: {role}
              </p>
              <p className={`text-[10px] truncate ${roleSubText}`}>
                Farm System Access
              </p>
            </div>
          </div>
        )}

        <SidebarNav groups={groups} collapsed={collapsed} isDark={isDark} />

        <div className={`p-3 border-t ${collapseBorder}`}>
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`flex items-center gap-2 w-full h-10 rounded-xl justify-center transition-colors duration-150 text-xs font-bold ${collapseBtn}`}
          >
            <FontAwesomeIcon
              icon={collapsed ? faAnglesRight : faAnglesLeft}
              className="w-4 h-4"
            />
            {!collapsed && <span>Collapse Menu</span>}
          </button>
        </div>
      </motion.aside>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 md:hidden"
              style={{
                backdropFilter: "blur(8px)",
                backgroundColor: "rgba(0,0,0,0.55)",
              }}
              onClick={onCloseMobile}
            />
            <motion.aside
              key="sidebar-drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col md:hidden border-r shadow-2xl ${sidebarBg}`}
            >
              <div className="flex items-center justify-between pr-2">
                <Brand collapsed={false} isDark={isDark} />
                <button
                  type="button"
                  onClick={onCloseMobile}
                  aria-label="Close menu"
                  className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${mobileCloseBtn}`}
                >
                  <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
                </button>
              </div>

              <SidebarNav
                groups={groups}
                collapsed={false}
                isDark={isDark}
                onNavigate={onCloseMobile}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
