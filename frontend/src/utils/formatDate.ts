/**
 * Formats an ISO date string for table/detail display (e.g. "Aug 12, 2026")
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
