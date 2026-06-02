"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/common/Icon";
import { moderateStory, type FlaggedStory, type Decision } from "@/lib/api/moderation";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return `${Math.floor(diff / 60_000)}m`;
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export function ModerationBoard({
  token,
  initial,
}: {
  token: string;
  initial: FlaggedStory[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<FlaggedStory[]>(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function act(id: string, decision: Decision, statusOverride?: string) {
    setBusy(id);
    setError(null);
    try {
      await moderateStory(token, id, { decision, statusOverride });
      setItems((prev) => prev.filter((s) => s.id !== id));
      startTransition(() => router.refresh());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="card" style={{ color: "var(--mute)" }}>
        Queue clear. Nothing to moderate right now.
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="card-flat" style={{ marginBottom: 16, color: "var(--accent-ink)" }}>
          {error}
        </div>
      )}
      <div style={{ display: "grid", gap: 16 }}>
        {items.map((s) => (
          <div key={s.id} className="card">
            <div className="row between" style={{ alignItems: "flex-start", gap: 16 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="row" style={{ gap: 8, marginBottom: 6 }}>
                  <span className="pill pill-warm">FLAGGED</span>
                  <span className="pill">{s.status}</span>
                  <span className="pill">{s.visibility}</span>
                  <span className="eyebrow" style={{ textTransform: "none", letterSpacing: 0 }}>
                    {timeAgo(s.updatedAt)}
                  </span>
                </div>
                <h3 style={{ fontFamily: "var(--display)", fontWeight: 400, fontSize: 22, margin: 0 }}>
                  {s.title ?? "Untitled story"}
                </h3>
                <div style={{ color: "var(--mute)", fontSize: "var(--t-2)", margin: "4px 0 10px" }}>
                  by @{s.user.username} · model {s.model?.label ?? "—"}
                </div>
                {s.synopsis && (
                  <p style={{ margin: 0, fontSize: "var(--t-2)", color: "var(--ink-2)" }}>{s.synopsis}</p>
                )}
                {s.tags.length > 0 && (
                  <div className="row" style={{ gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                    {s.tags.map((t) => (
                      <span key={t.id} className="pill">
                        {t.key}:{t.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="col" style={{ gap: 8, alignItems: "flex-end", flexShrink: 0 }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => act(s.id, "APPROVED", "PUBLISHED")}
                  disabled={busy === s.id}
                >
                  <Icon name="check" size={13} /> Approve
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => act(s.id, "REMOVED", "ARCHIVED")}
                  disabled={busy === s.id}
                >
                  <Icon name="lock" size={13} /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModerationBoard;
