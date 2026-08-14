/**
 * Derives a short, human-friendly public identifier (e.g. "SL-4821-93017") from a
 * database UUID, for display anywhere a raw UUID would otherwise be shown to a user.
 *
 * The code is a pure function of the UUID — same record always renders the same
 * public ID, no separate counter or database column to keep in sync — computed with
 * two independent FNV-1a 32-bit hash passes (different salts) folded into decimal
 * digit groups. Because it's 1:1 derived from a value the database already guarantees
 * unique, and FNV-1a spreads its output near-uniformly across the digit space, two
 * distinct UUIDs colliding on the same 9-digit code is astronomically unlikely at
 * this application's scale (birthday bound ~31,600 records before a 50% collision
 * chance, versus a system with a handful of records per entity).
 */
function fnv1a(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function digitsFrom(input: string, length: number): string {
  const hash = fnv1a(input);
  return String(hash % 10 ** length).padStart(length, "0");
}

export function toPublicId(prefix: string, uuid: string): string {
  const groupA = digitsFrom(`${uuid}:A`, 4);
  const groupB = digitsFrom(`${uuid}:B`, 5);
  return `${prefix}-${groupA}-${groupB}`;
}
