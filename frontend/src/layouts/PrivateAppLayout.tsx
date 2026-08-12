import { Outlet, Navigate } from "react-router-dom";
import { SidebarProvider, useSidebar } from "../contexts/SidebarContext";
import { useTheme } from "../contexts/ThemeContext";
import { Sidebar } from "../components/layout/Sidebar";
import { DashboardTopBar } from "../components/layout/DashboardTopBar";
import { MOCK_USER } from "../data/dashboardMockData";

function PrivateShell() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { isCollapsed, isOpen, toggleCollapsed, toggleOpen, closeSidebar } = useSidebar();

  // Demo user — replace with real auth session on backend integration
  const user = MOCK_USER;

  return (
    <div className={`flex h-screen w-full overflow-hidden font-kumbh ${isDark ? "bg-zinc-950" : "bg-zinc-50"}`}>
      <Sidebar
        role={user.role}
        collapsed={isCollapsed}
        onToggleCollapse={toggleCollapsed}
        mobileOpen={isOpen}
        onCloseMobile={closeSidebar}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardTopBar user={user} onOpenMobileSidebar={toggleOpen} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function PrivateAppLayout() {
  // Simple check for demo token — replace with proper auth context on backend integration
  const isAuthenticated = Boolean(localStorage.getItem("agrify_auth_token"));

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <SidebarProvider>
      <PrivateShell />
    </SidebarProvider>
  );
}

export default PrivateAppLayout;
