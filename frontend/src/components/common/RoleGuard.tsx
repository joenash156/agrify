import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../../contexts/AuthContext";
import type { UserRole } from "../../types/user";

interface RoleGuardProps {
  allow: UserRole[];
  children: ReactNode;
}

/** Redirects to the dashboard if the current user's role isn't in the allow-list — the backend
 * enforces the same restriction independently, this just avoids a dead/erroring page on direct nav. */
export function RoleGuard({ allow, children }: RoleGuardProps) {
  const user = useCurrentUser();
  if (!allow.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

export default RoleGuard;
