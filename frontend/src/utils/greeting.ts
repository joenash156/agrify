/**
  Generates an appropriate time-of-day greeting based on system local time.
  - 5:00 AM - 11:59 AM: Good morning
  - 12:00 PM - 4:59 PM: Good afternoon
  - 5:00 PM - 4:59 AM: Good evening
 */
export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

/**
 * Formats a user greeting string with their name
 */
export function formatGreeting(name?: string): string {
  const greeting = getTimeGreeting();
  return name ? `${greeting}, ${name}` : greeting;
}

/**
 * Formats current date for dashboard display (e.g. "Wednesday, Aug 12, 2026")
 */
export function formatFormattedDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
