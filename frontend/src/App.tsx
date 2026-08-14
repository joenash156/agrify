import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import PublicAppLayout from "./layouts/PublicAppLayout";
import PrivateAppLayout from "./layouts/PrivateAppLayout";
import AuthPage from "./pages/public/AuthPage";
import DashboardPage from "./pages/private/DashboardPage";
import FarmsPage from "./pages/private/FarmsPage";
import CropsPage from "./pages/private/CropsPage";
import DiseasesPage from "./pages/private/DiseasesPage";
import EquipmentPage from "./pages/private/EquipmentPage";
import FertilizersPage from "./pages/private/FertilizersPage";
import HarvestsPage from "./pages/private/HarvestsPage";
import InventoryPage from "./pages/private/InventoryPage";
import SalesPage from "./pages/private/SalesPage";
import PaymentsPage from "./pages/private/PaymentsPage";
import POSPage from "./pages/private/POSPage";
import EmployeesPage from "./pages/private/EmployeesPage";
import AttendancePage from "./pages/private/AttendancePage";
import AnalyticsPage from "./pages/private/AnalyticsPage";
import NotificationsPage from "./pages/private/NotificationsPage";
import SettingsPage from "./pages/private/SettingsPage";
import { RoleGuard } from "./components/common/RoleGuard";
import type { UserRole } from "./types/user";

const SALES_ROLES: UserRole[] = ["ADMIN", "FARM_MANAGER", "SALES_PERSON"];

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes under PublicAppLayout */}
              <Route element={<PublicAppLayout />}>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/login" element={<Navigate to="/auth" replace />} />
                <Route path="/register" element={<Navigate to="/auth" replace />} />
              </Route>

              {/* Protected Private Routes under PrivateAppLayout */}
              <Route element={<PrivateAppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/farms" element={<FarmsPage />} />
                <Route path="/crops" element={<CropsPage />} />
                <Route path="/diseases" element={<DiseasesPage />} />
                <Route path="/equipment" element={<EquipmentPage />} />
                <Route path="/fertilizers" element={<FertilizersPage />} />
                <Route path="/harvests" element={<HarvestsPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route
                  path="/pos"
                  element={
                    <RoleGuard allow={SALES_ROLES}>
                      <POSPage />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/sales"
                  element={
                    <RoleGuard allow={SALES_ROLES}>
                      <SalesPage />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/payments"
                  element={
                    <RoleGuard allow={SALES_ROLES}>
                      <PaymentsPage />
                    </RoleGuard>
                  }
                />
                <Route path="/employees" element={<EmployeesPage />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="/" element={<Navigate to="/auth" replace />} />
              <Route path="*" element={<Navigate to="/auth" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
