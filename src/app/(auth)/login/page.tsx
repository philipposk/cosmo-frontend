"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") ?? "/dashboard";
  const resetOk = searchParams?.get("reset") === "ok";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setError("Auth service not available");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    // onAuthStateChange in CosmoAuthProvider will pick this up automatically
    router.push(callbackUrl);
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const supabase = createClient();
    if (!supabase) {
      setGoogleLoading(false);
      return;
    }
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "32px 16px" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Welcome back</div>
        <h1 className="display" style={{ fontSize: 44, lineHeight: 1, margin: 0 }}>
          Sign in to <em>Cosmo</em>
        </h1>
        <p className="sub" style={{ marginTop: 10 }}>
          New here?{" "}
          <Link href="/register" style={{ color: "var(--accent-ink)", borderBottom: "1px solid var(--accent)" }}>
            Create an account
          </Link>
          .
        </p>

        {resetOk && (
          <div className="card-flat" style={{ marginTop: 16, color: "var(--cool)" }}>
            Password updated. Sign in with your new password.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="card" style={{ marginTop: 22 }}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <div style={{ color: "var(--accent-ink)", fontSize: "var(--t-1)" }}>{errors.email.message}</div>
            )}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete="current-password" {...register("password")} />
            {errors.password && (
              <div style={{ color: "var(--accent-ink)", fontSize: "var(--t-1)" }}>{errors.password.message}</div>
            )}
            <div className="hint">
              <Link href="/auth/forgot" style={{ color: "var(--mute)", borderBottom: "1px solid var(--line)" }}>
                Forgot password?
              </Link>
            </div>
          </div>

          {error && <div style={{ color: "var(--accent-ink)", fontSize: "var(--t-2)" }}>{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "12px 0" }}>
            <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
            <span style={{ color: "var(--mute)", fontSize: "var(--t-1)" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
          </div>

          <button
            type="button"
            className="btn"
            disabled={googleLoading}
            onClick={handleGoogle}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {googleLoading ? "Redirecting…" : "Continue with Google"}
          </button>
        </form>
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
