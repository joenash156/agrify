import { Navigate, useLocation } from "react-router-dom";
import { SidebarProvider, useSidebar } from "../contexts/SidebarContext";
import { NotificationsProvider } from "../contexts/NotificationsContext";
import { useAuth, useCurrentUser } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Sidebar } from "../components/layout/Sidebar";
import { DashboardTopBar } from "../components/layout/DashboardTopBar";
import { AnimatedOutlet } from "../components/layout/AnimatedOutlet";
import { useScrollToTop } from "../hooks/useScrollToTop";
import type { UserProfile } from "../types/user";

function PrivateShell() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { isCollapsed, isOpen, toggleCollapsed, toggleOpen, closeSidebar } = useSidebar();
  const authUser = useCurrentUser();
  const scrollRef = useScrollToTop<HTMLElement>();
  const location = useLocation();

  // Non-ACTIVE accounts still get the full shell (sidebar visible, top bar visible) —
  // the sidebar just disables every link but Dashboard, and any other route bounces
  // back to Dashboard, which itself shows the pending/suspended notice in place of
  // its stats and charts. See AccountPendingNotice. ADMIN is exempt: it's the system's
  // prime role and always has full access regardless of accountStatus.
  const isRestricted = authUser.accountStatus !== "ACTIVE" && authUser.role !== "ADMIN";

  const user: UserProfile = {
    id: authUser.userId,
    firstName: authUser.firstName,
    lastName: authUser.lastName,
    email: authUser.email,
    role: authUser.role,
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden font-kumbh ${isDark ? "bg-zinc-950" : "bg-zinc-50"}`}>
      <Sidebar
        role={user.role}
        collapsed={isCollapsed}
        onToggleCollapse={toggleCollapsed}
        mobileOpen={isOpen}
        onCloseMobile={closeSidebar}
        restricted={isRestricted}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardTopBar user={user} onOpenMobileSidebar={toggleOpen} />

        <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {isRestricted && location.pathname !== "/dashboard" ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AnimatedOutlet />
          )}
        </main>
      </div>
    </div>
  );
}

export function PrivateAppLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Brief silent-refresh check on load — avoids a login-page flash for an already-valid session.
    return null;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <SidebarProvider>
      <NotificationsProvider>
        <PrivateShell />
      </NotificationsProvider>
    </SidebarProvider>
  );
}

export default PrivateAppLayout;
