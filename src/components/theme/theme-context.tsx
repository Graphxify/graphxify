"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyThemeClass(theme: Theme): void {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
}

export function GraphxifyThemeProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [theme, setThemeState] = useState<Theme>("dark");

  const resolveAndApply = useCallback((selected: Theme) => {
    applyThemeClass(selected);
  }, []);

  useEffect(() => {
    resolveAndApply(theme);
  }, [theme, resolveAndApply]);

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next);
      resolveAndApply(next);
    },
    [resolveAndApply]
  );

  const value = useMemo(
    () => ({
      theme,
      setTheme
    }),
    [theme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useGraphxifyTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useGraphxifyTheme must be used within GraphxifyThemeProvider");
  }
  return context;
}
