import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ThemeMode, ThemePreference } from "../types/theme";

interface ThemeContextType {
  theme: ThemeMode;
  preference: ThemePreference;
  setTheme: (pref: ThemePreference) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>(() => {
    const stored = localStorage.getItem("theme") as ThemePreference | null;
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
    return "system";
  });

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (preference === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return preference;
  });

  useEffect(() => {
    localStorage.setItem("theme", preference);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (isDarkSystem: boolean) => {
      const activeTheme: ThemeMode =
        preference === "system"
          ? isDarkSystem
            ? "dark"
            : "light"
          : preference;

      setThemeState(activeTheme);

      if (activeTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    applyTheme(mediaQuery.matches);

    if (preference === "system") {
      const listener = (e: MediaQueryListEvent) => {
        applyTheme(e.matches);
      };

      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, [preference]);

  const setTheme = (pref: ThemePreference) => {
    setPreference(pref);
  };

  const toggleTheme = () => {
    setPreference((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, preference, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
