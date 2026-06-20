/**
 * Server-side session helper — drop-in replacement for next-auth's getServerSession().
 * Reads the Supabase session from the shared SSO cookie, then exchanges the
 * Supabase access token for a Cosmo JWT via POST /auth/supabase-exchange.
 *
 * Usage (same as before):
 *   const session = await getServerSession();
 *   const token = session?.user?.token ?? null;
 */

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { CosmoSession, CosmoUser } from "./session";

async function exchangeToken(supabaseAccessToken: string): Promise<CosmoUser | null> {
  const backendUrl =
    process.env.BACKEND_API_URL ??
    process.env.NEXT_PUBLIC_BACKEND_API_URL ??
    "http://localhost:4000";

  try {
    const res = await fetch(`${backendUrl}/auth/supabase-exchange`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${supabaseAccessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      // Cap the wait so a slow/down backend can't stall server rendering.
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

/**
 * Drop-in for next-auth's getServerSession(authOptions).
 * Call it from any Server Component or Route Handler.
 *
 * Wrapped in React's cache() so multiple server components rendering in the
 * same request share ONE token exchange instead of hitting the backend once
 * per component.
 *
 * Returns null when the user is not signed in.
 */
export const getServerSession = cache(
  async (): Promise<CosmoSession | null> => {
    const supabase = await createClient();
    if (!supabase) return null;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return null;

    const user = await exchangeToken(session.access_token);
    if (!user) return null;

    return {
      user,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  },
);
