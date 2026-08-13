import type { UserRole } from "../types/user";

/**
 * Admins and farm managers can create/edit/delete records.
 * Other roles (sales person, worker) are view-only.
 * Frontend-only gating for UX — the backend remains the source of truth for authorization.
 */
export function canManageRecords(role: UserRole): boolean {
  return role === "ADMIN" || role === "FARM_MANAGER";
}

/**
 * For records owned by a specific staff member (e.g. a sale they made).
 * Admins/managers can manage every record; the owner can manage their own;
 * everyone else is view-only.
 */
export function canManageOwnedRecord(role: UserRole, isOwner: boolean): boolean {
  if (role === "ADMIN" || role === "FARM_MANAGER") return true;
  return isOwner;
}

/** Sales staff (plus admins/managers) can create new sales; workers cannot. */
export function canCreateSales(role: UserRole): boolean {
  return role === "ADMIN" || role === "FARM_MANAGER" || role === "SALES_PERSON";
}
