import type { Metadata } from "next";
import Link from "next/link";
import { safeNext } from "@/lib/safe-next.mjs";

export const metadata: Metadata = { title: "Sign in · Cosmo", robots: { index: false, follow: false } };

const LINK_TYPES = ["magiclink", "signup", "invite", "email", "email_change"];

type Props = { searchParams: Promise<{ token_hash?: string; type?: string; next?: string }> };

/**
 * Landing page for emailed links built from a Supabase `token_hash`. Opening it does nothing by itself:
 * the one-time token is only spent when the person taps the button (a same-origin POST to /auth/verify).
 * That stops mail scanners from burning links, and stops a crafted GET link from signing a visitor into
 * someone else's account. (Supabase's own `{{ .ConfirmationURL }}` links go to /auth/callback instead.)
 */
export default async function ConfirmPage({ searchParams }: Props) {
  const sp = await searchParams;
  const tokenHash = typeof sp.token_hash === "string" && /^[A-Za-z0-9_-]{10,200}$/.test(sp.token_hash) ? sp.token_hash : null;
  const type = typeof sp.type === "string" && LINK_TYPES.includes(sp.type) ? sp.type : "magiclink";
  const next = safeNext(sp.next ?? null, "/dashboard");

  return (
    <div className="content" style={{ maxWidth: 520, margin: "0 auto" }}>
      <div className="eyebrow">Sign in</div>
      <h1 className="display">Cosmo</h1>
      {tokenHash ? (
        <form action="/auth/verify" method="post" style={{ marginTop: 18 }}>
          <p className="sub">Tap the button to finish signing in.</p>
          <input type="hidden" name="token_hash" value={tokenHash} />
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="next" value={next} />
          <div style={{ marginTop: 18 }}>
            <button type="submit" className="btn btn-primary">Sign in to Cosmo</button>
          </div>
        </form>
      ) : (
        <div style={{ marginTop: 18 }}>
          <p className="sub">This sign-in link is incomplete or has expired.</p>
          <div style={{ marginTop: 18 }}>
            <Link href="/login" className="btn btn-primary">Get a new link</Link>
          </div>
        </div>
      )}
    </div>
  );
}
