// The backend's GlobalExceptionHandler always responds with { error: "friendly message" }
// for validation/constraint/business-rule failures — this pulls that message out of an
// Axios error first. A plain client-thrown Error (e.g. a frontend-only validation check
// before a request is even sent) falls back to its own .message rather than being
// discarded, so callers can `throw new Error("...")` from inside an onSubmit and have
// that exact text reach the user. Only truly unrecognized failures use the fallback.
export function extractErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const response = (err as { response?: { data?: { error?: string } } }).response;
    if (response?.data?.error) return response.data.error;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
