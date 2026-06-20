"use client";

/**
 * Drop-in replacement for next-auth/react useSession / signOut / signIn.
 * Backed by Supabase Auth. Returns the same session shape the app already
 * expects:  session.user.{ id, username, displayName, roles, token, ... }
 *
 * "token" is a Cosmo NestJS JWT obtained by exchanging the Supabase
 * access token via POST /auth/supabase-exchange on the backend.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Session as SupabaseSession } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

// ---------------------------------------------------------------------------
// Types — mirror the next-auth Session shape the app already uses
// ---------------------------------------------------------------------------

export interface CosmoUser {
  id: string;
  email?: string | null;
  name?: string | null;       // alias for displayName, kept for compat
  image?: string | null;      // alias for avatarUrl, kept for compat
  username: string;
  displayName: string;
  roles: string[];
  avatarUrl?: string | null;
  privacyLevel: string;
  ageGateStatus: string;
  parentalControlLevel?: number | null;
  onboardingCompleted: boolean;
  /** Cosmo NestJS JWT — used for all API calls */
  token?: string | null;
}

export interface CosmoSession {
  user: CosmoUser;
  expires: string;
}

export type SessionStatus = "loading" | "authenticated" | "unauthenticated";

interface SessionContextValue {
  data: CosmoSession | null;
  status: SessionStatus;
  update: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const SessionContext = createContext<SessionContextValue>({
  data: null,
  status: "loading",
  update: async () => {},
});

// ---------------------------------------------------------------------------
// Exchange Supabase token → Cosmo JWT + profile
// ---------------------------------------------------------------------------

async function exchangeToken(supabaseAccessToken: string): Promise<CosmoUser | null> {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "http://localhost:4000";

  try {
    const res = await fetch(`${backendUrl}/auth/supabase-exchange`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${supabaseAccessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      // Don't let a slow/down backend hang the auth state forever.
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return null;

    const data = await res.json();

    return {
      id: data.id,
      email: data.email ?? null,
      name: data.displayName ?? data.username,
      image: data.avatarUrl ?? null,
      username: data.username,
      displayName: data.displayName,
      roles: data.roles ?? [],
      avatarUrl: data.avatarUrl ?? null,
      privacyLevel: data.privacyLevel ?? "PUBLIC",
      ageGateStatus: data.ageGateStatus ?? "UNKNOWN",
      parentalControlLevel: data.parentalControlLevel ?? null,
      onboardingCompleted: Boolean(data.onboardingCompleted),
      token: data.token ?? null,
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function CosmoAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<CosmoSession | null>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");
  // Memoise the client so the auth-listener effect subscribes exactly once
  // instead of re-subscribing on every render.
  const supabase = useMemo(() => createClient(), []);

  // The last access token we exchanged SUCCESSFULLY. Used to skip redundant
  // exchanges. Only set on success, so a failed exchange stays retryable, and
  // a different token (e.g. after logout→login) always re-exchanges.
  const lastTokenRef = useRef<string | null>(null);

  const hydrateFromSupabase = useCallback(
    async (supabaseSession: SupabaseSession | null) => {
      if (!supabaseSession) {
        setSession(null);
        setStatus("unauthenticated");
        lastTokenRef.current = null;
        return;
      }

      const accessToken = supabaseSession.access_token;

      // Already exchanged this exact token successfully — nothing to do.
      // (No `status` read here: that would be a stale closure value.)
      if (accessToken === lastTokenRef.current) {
        return;
      }

      setStatus("loading");

      const user = await exchangeToken(accessToken);

      if (user) {
        lastTokenRef.current = accessToken; // record only on success
        const expires = new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString();
        setSession({ user, expires });
        setStatus("authenticated");
      } else {
        lastTokenRef.current = null; // allow a later retry
        setSession(null);
        setStatus("unauthenticated");
      }
    },
    [],
  );

  useEffect(() => {
    if (!supabase) {
      // Supabase not configured — stay unauthenticated (guest mode)
      setStatus("unauthenticated");
      return;
    }

    // Prime from existing session on mount
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      hydrateFromSupabase(s);
    });

    // Watch for sign-in / sign-out / token refresh events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      hydrateFromSupabase(s);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = useCallback(async () => {
    if (!supabase) return;
    const { data: { session: s } } = await supabase.auth.getSession();
    lastTokenRef.current = null; // force re-exchange
    await hydrateFromSupabase(s);
  }, [hydrateFromSupabase, supabase]);

  return (
    <SessionContext.Provider value={{ data: session, status, update }}>
      {children}
    </SessionContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hooks & helpers — same API surface as next-auth/react
// ---------------------------------------------------------------------------

/** Drop-in for next-auth's useSession() */
export function useSession() {
  return useContext(SessionContext);
}

/** Sign out of Supabase (clears the shared SSO cookie) and redirect */
export async function signOut(options?: { callbackUrl?: string }) {
  const supabase = createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  const url = options?.callbackUrl ?? "/login";
  window.location.href = url;
}

/**
 * Thin helper — mostly the login page calls Supabase directly.
 * Kept here so components can call signIn("google") for OAuth.
 */
export async function signIn(
  provider: string,
  options?: {
    identifier?: string;
    password?: string;
    email?: string;
    callbackUrl?: string;
    redirect?: boolean;
  },
): Promise<{ error?: string } | void> {
  const supabase = createClient();
  if (!supabase) {
    return { error: "Auth not configured" };
  }

  if (provider === "google") {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return;
  }

  // email / credentials fallback
  const email = options?.email ?? options?.identifier ?? "";
  const password = options?.password ?? "";
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  if (options?.redirect !== false) {
    window.location.href = options?.callbackUrl ?? "/dashboard";
  }
}
