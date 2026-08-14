// The backend's GlobalExceptionHandler always responds with { error: "friendly message" }
// for validation/constraint/business-rule failures — this pulls that message out of an
// Axios error, falling back to a generic message for anything unexpected (network drop, etc).
export function extractErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const response = (err as { response?: { data?: { error?: string } } }).response;
    if (response?.data?.error) return response.data.error;
  }
  return fallback;
}
