import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { cookieOptionsForHost, hostFromHeaders } from "./cookies";

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const cookieStore = await cookies();
  return createServerClient(url, key, {
      cookieOptions: cookieOptionsForHost(hostFromHeaders(await headers())),
      db: { schema: "cosmo" },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // called from a Server Component — middleware refreshes the session instead
          }
        },
      },
    },
  );
}
