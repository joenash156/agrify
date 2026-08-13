import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
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
import EmployeesPage from "./pages/private/EmployeesPage";
import AttendancePage from "./pages/private/AttendancePage";
import AnalyticsPage from "./pages/private/AnalyticsPage";
import NotificationsPage from "./pages/private/NotificationsPage";
import SettingsPage from "./pages/private/SettingsPage";

export function App() {
  return (
    <ThemeProvider>
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
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
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
    </ThemeProvider>
  );
}

export default App;
