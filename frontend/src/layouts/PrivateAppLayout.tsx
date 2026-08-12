import { Outlet, Navigate } from "react-router-dom";
import { SidebarProvider } from "../contexts/SidebarContext";

export function PrivateAppLayout() {
  // Simple check for demo token — replace with proper auth context on backend integration
  const isAuthenticated = Boolean(localStorage.getItem("agrify_auth_token"));

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <SidebarProvider>
      <div className="font-kumbh">
        {/* The dashboard page itself controls layout (sidebar + topbar + content)
          so this wrapper just provides context and the router outlet */}
        <Outlet />
      </div>
    </SidebarProvider>
  );
}

export default PrivateAppLayout;
