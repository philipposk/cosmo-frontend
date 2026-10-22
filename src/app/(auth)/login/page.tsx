"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { safeNext } from "@/lib/safe-next.mjs";

const RESEND_COOLDOWN_S = 60;
const NETWORK_ERROR = "Could not reach the server. Check your connection and try again.";
const LINK_ERROR =
  "That sign-in link did not work. It may have expired or been used already, or been opened in a different browser. Ask for a new link.";
const BUSY_ERROR = "Email sign-in is busy right now. Use Google, or try again in a few minutes.";
const CODE_ERROR = "That code did not work. It may have expired or been used already. Ask for a new link.";

type AuthErr = { message: string; status?: number } | null;

function isRateLimit(err: NonNullable<AuthErr>): boolean {
  const msg = err.message.toLowerCase();
  return err.status === 429 || msg.includes("rate limit") || msg.includes("only request this after");
}

/**
 * Sign-in is passwordless: Google, or a one-time link + code emailed by Supabase.
 * Every *.6x7.gr app shares one auth store and one session cookie, so there is no password signup:
 * a server-created password account for someone else's email would open that person's account everywhere.
 * People who signed up with a password before keep the same account: the emailed link signs them in.
 */
function LoginPageContent() {
  const searchParams = useSearchParams();
  // `callbackUrl` is what the guest prompts and protected pages already send; `next` is the shared 6x7 name.
  const next = safeNext(searchParams?.get("next") ?? searchParams?.get("callbackUrl") ?? null, "/dashboard");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(searchParams?.get("error") ? LINK_ERROR : "");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function sendLink(e?: React.FormEvent) {
    e?.preventDefault();
    const supabase = createClient();
    if (!supabase) {
      setError("Auth service not available");
      return;
    }
    setLoading(true);
    setError("");
    let otpErr: AuthErr = null;
    try {
      ({ error: otpErr } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
      }));
    } catch {
      otpErr = { message: NETWORK_ERROR };
    }
    setLoading(false);
    if (otpErr) {
      setError(isRateLimit(otpErr) ? BUSY_ERROR : otpErr.message);
      return;
    }
    setCode("");
    setSent(true);
    setCooldown(RESEND_COOLDOWN_S);
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    if (!supabase) {
      setError("Auth service not available");
      return;
    }
    setLoading(true);
    setError("");
    let failed = "";
    try {
      const { error: verifyErr } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code.replace(/\s/g, ""),
        type: "email",
      });
      if (verifyErr) failed = isRateLimit(verifyErr) ? BUSY_ERROR : CODE_ERROR;
    } catch {
      failed = NETWORK_ERROR;
    }
    if (failed) {
      setError(failed);
      setLoading(false);
      return;
    }
    // onAuthStateChange in CosmoAuthProvider picks the session up; a full navigation also makes
    // server components read the fresh shared cookie.
    window.location.replace(next);
  }

  async function handleGoogle() {
    const supabase = createClient();
    if (!supabase) {
      setError("Auth service not available");
      return;
    }
    setGoogleLoading(true);
    setError("");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
  }

  const errorBox = error && (
    <div role="alert" style={{ color: "var(--accent-ink)", fontSize: "var(--t-2)", marginBottom: 12 }}>
      {error}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "32px 16px" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>{sent ? "Check your email" : "Welcome"}</div>
        <h1 className="display" style={{ fontSize: 44, lineHeight: 1, margin: 0 }}>
          Sign in to <em>Cosmo</em>
        </h1>
        <p className="sub" style={{ marginTop: 10 }}>
          No password needed. New here? The link creates your account. Used a password before? Same email, same
          account.
        </p>

        {sent ? (
          <div className="card" style={{ marginTop: 22 }}>
            <p style={{ margin: "0 0 16px" }}>
              We sent a sign-in link to <strong>{email.trim()}</strong>. Open it on this device, or type the code from
              the email below. Check your spam folder too.
            </p>
            <form onSubmit={verifyCode}>
              <div className="field">
                <label htmlFor="code">Code from the email</label>
                <input
                  id="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  minLength={6}
                  maxLength={12}
                  style={{ letterSpacing: "0.2em" }}
                />
              </div>
              {errorBox}
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%" }}>
                {loading ? "Signing in…" : "Sign in with code"}
              </button>
            </form>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: "var(--t-2)" }}>
              <button
                type="button"
                onClick={() => { setSent(false); setError(""); }}
                style={{ background: "none", border: 0, padding: 0, color: "var(--mute)", textDecoration: "underline", cursor: "pointer" }}
              >
                Use a different email
              </button>
              <button
                type="button"
                disabled={loading || cooldown > 0}
                onClick={() => void sendLink()}
                style={{
                  background: "none", border: 0, padding: 0, color: "var(--accent-ink)", textDecoration: "underline",
                  cursor: loading || cooldown > 0 ? "not-allowed" : "pointer", opacity: loading || cooldown > 0 ? 0.5 : 1,
                }}
              >
                {cooldown > 0 ? `Send a new link (${cooldown}s)` : "Send a new link"}
              </button>
            </div>
          </div>
        ) : (
          <div className="card" style={{ marginTop: 22 }}>
            <button
              type="button"
              className="btn"
              disabled={googleLoading}
              onClick={handleGoogle}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {googleLoading ? "Redirecting…" : "Continue with Google"}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "16px 0" }}>
              <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
              <span style={{ color: "var(--mute)", fontSize: "var(--t-1)" }}>or</span>
              <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
            </div>

            <form onSubmit={sendLink}>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {errorBox}
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%" }}>
                {loading ? "Sending…" : "Email me a sign-in link"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: 60, textAlign: "center", color: "var(--mute)" }}>Loading…</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
