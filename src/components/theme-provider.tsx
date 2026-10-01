import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null);

const KEY = "dharohar.theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme] = useState<Theme>("dark");

  useEffect(() => {
    // Permanently enforce dark mode across the entire application
    if (typeof document !== "undefined") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(KEY, "dark");
      } catch {
        // ignore localStorage access issues
      }
    }
  }, []);

  const toggle = useCallback(() => {
    // Dark mode is permanently enforced; toggle is intentionally a no-op
    if (typeof document !== "undefined") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  }, []);

  const value = useMemo(() => ({ theme: "dark" as const, toggle }), [toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
