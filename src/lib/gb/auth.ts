/**
 * Auth adapter.
 *
 * The UI depends only on `AuthAdapter` + `useAuth()`. Today it is a local,
 * session-scoped stub; when the GharBazaar backend lands, implement the same
 * interface against Supabase auth and swap the `authAdapter` binding below.
 */
import { useCallback, useEffect, useState } from "react";

export interface AuthUser {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
}

export interface AuthAdapter {
  getUser(): Promise<AuthUser | null>;
  requestOtp(phone: string): Promise<{ sent: boolean; message: string }>;
  verifyOtp(phone: string, code: string): Promise<AuthUser>;
  signOut(): Promise<void>;
  subscribe(listener: (user: AuthUser | null) => void): () => void;
}

const AUTH_EVENT = "gharbazaar:auth-change";
const AUTH_KEY = "gharbazaar:auth-user";

function readUser(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function writeUser(user: AuthUser | null) {
  try {
    if (user) window.localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(AUTH_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: user }));
}

export const localAuthAdapter: AuthAdapter = {
  async getUser() {
    return readUser();
  },
  async requestOtp(phone) {
    if (!/^\d{10}$/.test(phone.replace(/\D/g, "").slice(-10))) {
      return { sent: false, message: "Enter a valid 10-digit mobile number." };
    }
    return { sent: true, message: "Sign-in goes live once the GharBazaar backend is connected." };
  },
  async verifyOtp(phone) {
    const user: AuthUser = { id: `local-${phone}`, name: null, phone, email: null };
    writeUser(user);
    return user;
  },
  async signOut() {
    writeUser(null);
  },
  subscribe(listener) {
    const handler = () => listener(readUser());
    window.addEventListener(AUTH_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(AUTH_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  },
};

/** Swap this binding for a Supabase-backed implementation when the backend lands. */
export const authAdapter: AuthAdapter = localAuthAdapter;

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    authAdapter.getUser().then((u) => {
      if (!active) return;
      setUser(u);
      setReady(true);
    });
    const unsubscribe = authAdapter.subscribe(setUser);
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const signOut = useCallback(() => authAdapter.signOut(), []);
  return { user, ready, isAuthenticated: user !== null, signOut };
}
