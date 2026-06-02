"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api/client";

export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    if (!email) return;
    setBusy(true);
    setError(null);
    try {
      await apiFetch("/auth/request-reset", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setDone(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="card-flat" style={{ color: "var(--mute)" }}>
        If that email exists, we&apos;ve sent a reset link. Check your inbox (or the backend console in dev).
      </div>
    );
  }

  return (
    <div className="card">
      <div className="field">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      {error && <div style={{ color: "var(--accent-ink)", fontSize: "var(--t-1)" }}>{error}</div>}
      <button type="button" className="btn btn-primary" onClick={onSubmit} disabled={busy || !email}>
        {busy ? "Sending…" : "Send reset link"}
      </button>
    </div>
  );
}

export default ForgotForm;
