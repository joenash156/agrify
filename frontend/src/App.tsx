import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import PublicAppLayout from "./layouts/PublicAppLayout";
import PrivateAppLayout from "./layouts/PrivateAppLayout";
import AuthPage from "./pages/public/AuthPage";
import DashboardPage from "./pages/private/DashboardPage";

export function App() {
  return (
    <ThemeProvider>
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
          </Route>

          {/* Catch-all redirect */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
