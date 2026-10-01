import { useEffect, useState } from "react";

/**
 * localStorage-backed state that is SSR-safe: renders with `initial` during
 * SSR and the first client render, then hydrates from storage.
 */
export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // corrupted value — fall back to initial
    }
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or blocked — keep in-memory value
    }
  }, [key, value, ready]);

  return [value, setValue, ready] as const;
}

/** Shared keys so separate pages read/write the same store. */
export const STORE_KEYS = {
  saved: "dharohar.saved",
  quiz: "dharohar.quiz",
} as const;

export type SavedStore = { sites: string[]; trails: string[] };

export type QuizStats = {
  playedDates: string[];
  bestScore: number;
  perfectRuns: number;
};
