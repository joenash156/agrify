import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as authService from "../services/authService";
import type { AuthUser, RegisterPayload } from "../services/authService";

interface AuthContextValue {
  user: AuthUser | null;
  /** True while the initial silent session-restore (via the refresh cookie) is in flight. */
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  /** Merges a partial profile update into the cached user — e.g. after editing name in Settings,
   * so the sidebar/top bar reflect it immediately without waiting for the next token refresh. */
  updateUserProfile: (updates: Partial<Pick<AuthUser, "firstName" | "lastName">>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authService.bootstrapSession().then((restoredUser) => {
      setUser(restoredUser);
      setIsLoading(false);
    });
  }, []);

  const login = async (username: string, password: string) => {
    const loggedInUser = await authService.login(username, password);
    setUser(loggedInUser);
  };

  const register = async (payload: RegisterPayload) => {
    await authService.register(payload);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateUserProfile = (updates: Partial<Pick<AuthUser, "firstName" | "lastName">>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

/** For components that only ever render inside PrivateAppLayout, where a user is guaranteed. */
// eslint-disable-next-line react-refresh/only-export-components
export function useCurrentUser(): AuthUser {
  const { user } = useAuth();
  if (!user) throw new Error("useCurrentUser called outside an authenticated route");
  return user;
}
