"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";

export function ResetForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return <div className="card-flat" style={{ color: "var(--mute)" }}>Open the link from your reset email.</div>;
  }

  async function onSubmit() {
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      router.push("/login?reset=ok");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <div className="field">
        <label>New password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="hint">8 characters minimum.</div>
      </div>
      {error && <div style={{ color: "var(--accent-ink)", fontSize: "var(--t-1)" }}>{error}</div>}
      <button type="button" className="btn btn-primary" onClick={onSubmit} disabled={busy || !password}>
        {busy ? "Saving…" : "Set new password"}
      </button>
    </div>
  );
}

export default ResetForm;
