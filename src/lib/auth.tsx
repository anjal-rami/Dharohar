import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Role = "visitor" | "contributor" | "moderator" | "admin";

export type SessionUser = {
  id: string;
  name: string;
  role: Role;
  state: string;
  points: number;
};

export const DEMO_USERS: SessionUser[] = [
  { id: "u-visitor", name: "Riya (Visitor)", role: "visitor", state: "Maharashtra", points: 120 },
  {
    id: "u-contributor",
    name: "Akshat (Contributor)",
    role: "contributor",
    state: "Karnataka",
    points: 6480,
  },
  {
    id: "u-moderator",
    name: "Meera (Moderator)",
    role: "moderator",
    state: "Tamil Nadu",
    points: 11200,
  },
  { id: "u-admin", name: "Arjun (Admin)", role: "admin", state: "Delhi", points: 23400 },
];

const STORAGE_KEY = "dharohar.session";

export function canModerate(user: SessionUser | null): boolean {
  return user?.role === "moderator" || user?.role === "admin";
}

type AuthValue = {
  /** Null until hydrated from localStorage on the client. */
  user: SessionUser | null;
  ready: boolean;
  signIn: (user: SessionUser) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as SessionUser);
    } catch {
      // corrupted session — ignore and stay signed out
    }
    setReady(true);
  }, []);

  const signIn = useCallback((next: SessionUser) => {
    setUser(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable — session lives for the tab only
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(() => ({ user, ready, signIn, signOut }), [user, ready, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
