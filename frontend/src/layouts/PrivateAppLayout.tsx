import { Outlet, Navigate } from "react-router-dom";
import { SidebarProvider } from "../contexts/SidebarContext";

export function PrivateAppLayout() {
  // Simple check for demo token
  const isAuthenticated = Boolean(localStorage.getItem("agrify_auth_token"));

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white font-sans flex">
        <main className="flex-1 w-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}

export default PrivateAppLayout;
