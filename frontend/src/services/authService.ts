import { httpClient, setAccessToken, getAccessToken, refreshAccessToken } from "./httpClient";
import type { UserRole } from "../types/user";

export type AccountStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface AuthUser {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  accountStatus: AccountStatus;
}

interface AuthResponse extends AuthUser {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

function toAuthUser(data: AuthResponse): AuthUser {
  const { userId, username, firstName, lastName, email, role, accountStatus } = data;
  return { userId, username, firstName, lastName, email, role, accountStatus };
}

export async function login(username: string, password: string): Promise<AuthUser> {
  const { data } = await httpClient.post<AuthResponse>("/auth/login", { username, password });
  setAccessToken(data.accessToken);
  return toAuthUser(data);
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username: string;
  password: string;
}

export async function register(payload: RegisterPayload): Promise<void> {
  await httpClient.post("/auth/register", payload);
}

/** Attempts a silent session restore using the httpOnly refresh cookie — call once on app load. */
export async function bootstrapSession(): Promise<AuthUser | null> {
  const { data } = await httpClient.post<AuthResponse>("/auth/refresh").catch(() => ({ data: null }));
  if (!data) return null;
  setAccessToken(data.accessToken);
  return toAuthUser(data);
}

export async function logout(): Promise<void> {
  try {
    await httpClient.post("/auth/logout");
  } finally {
    setAccessToken(null);
  }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await httpClient.put("/auth/change-password", { currentPassword, newPassword });
}

export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}

export { refreshAccessToken };
