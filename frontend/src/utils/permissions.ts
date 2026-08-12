import type { UserRole } from "../types/user";

/**
 * Admins and farm managers can create/edit/delete records.
 * Other roles (sales person, worker) are view-only.
 * Frontend-only gating for UX — the backend remains the source of truth for authorization.
 */
export function canManageRecords(role: UserRole): boolean {
  return role === "ADMIN" || role === "FARM_MANAGER";
}
