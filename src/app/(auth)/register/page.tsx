"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const registerSchema = z
  .object({
    email: z.string().email("Enter a valid email address"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(/^[a-z0-9_]+$/i, "Use letters, numbers, and underscores only"),
    displayName: z.string().min(1, "Display name is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string().min(8, "Confirm your password"),
    bio: z.string().max(2800, "Bio must be under 2800 characters").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifyPending, setVerifyPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setError("Auth service not available");
      setLoading(false);
      return;
    }

    // Sign up via Supabase — stores username/displayName/bio in user_metadata
    // The backend JIT-provisions the Cosmo user on first sign-in via /auth/supabase-exchange
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          username: values.username,
          display_name: values.displayName,
          full_name: values.displayName,
          bio: values.bio ?? "",
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // If email confirmation is required, Supabase returns an unconfirmed session
    if (data.session) {
      // Auto-confirmed (e.g. dev mode) — go straight to onboarding
      router.push("/onboarding/welcome");
    } else {
      // Email confirmation pending
      setVerifyPending(true);
    }
  };

  if (verifyPending) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "32px 16px" }}>
        <div style={{ width: "100%", maxWidth: 440, textAlign: "center" }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Check your inbox</div>
          <h1 className="display" style={{ fontSize: 36, lineHeight: 1.1, margin: 0 }}>
            Confirm your email
          </h1>
          <p className="sub" style={{ marginTop: 14 }}>
            We sent a confirmation link to your email address.
            Click it to activate your account, then come back to sign in.
          </p>
          <Link href="/login" className="btn btn-primary" style={{ display: "inline-block", marginTop: 24 }}>
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "32px 16px" }}>
      <div style={{ width: "100%", maxWidth: 520 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>New account</div>
        <h1 className="display" style={{ fontSize: 44, lineHeight: 1, margin: 0 }}>
          Join <em>Cosmo</em>
        </h1>
        <p className="sub" style={{ marginTop: 10 }}>
          Already a member?{" "}
          <Link href="/login" style={{ color: "var(--accent-ink)", borderBottom: "1px solid var(--accent)" }}>
            Sign in
          </Link>
          .
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="card" style={{ marginTop: 22 }}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="email" {...register("email")} />
            {errors.email && <div style={{ color: "var(--accent-ink)", fontSize: "var(--t-1)" }}>{errors.email.message}</div>}
          </div>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input id="username" type="text" autoComplete="username" {...register("username")} />
            {errors.username && <div style={{ color: "var(--accent-ink)", fontSize: "var(--t-1)" }}>{errors.username.message}</div>}
          </div>
          <div className="field">
            <label htmlFor="displayName">Display name</label>
            <input id="displayName" type="text" {...register("displayName")} />
            {errors.displayName && <div style={{ color: "var(--accent-ink)", fontSize: "var(--t-1)" }}>{errors.displayName.message}</div>}
          </div>
          <div className="field">
            <label htmlFor="bio">Bio <span className="hint" style={{ marginLeft: 6 }}>(optional)</span></label>
            <textarea id="bio" rows={3} {...register("bio")} />
            {errors.bio && <div style={{ color: "var(--accent-ink)", fontSize: "var(--t-1)" }}>{errors.bio.message}</div>}
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete="new-password" {...register("password")} />
            {errors.password && <div style={{ color: "var(--accent-ink)", fontSize: "var(--t-1)" }}>{errors.password.message}</div>}
            <div className="hint">8+ chars, at least one uppercase letter and one number.</div>
          </div>
          <div className="field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input id="confirmPassword" type="password" autoComplete="new-password" {...register("confirmPassword")} />
            {errors.confirmPassword && <div style={{ color: "var(--accent-ink)", fontSize: "var(--t-1)" }}>{errors.confirmPassword.message}</div>}
          </div>
          {error && <div style={{ color: "var(--accent-ink)", fontSize: "var(--t-2)" }}>{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
