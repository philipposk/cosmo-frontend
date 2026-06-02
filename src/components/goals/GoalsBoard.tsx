"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/common/Icon";
import { createGoal, deleteGoal, logProgress, type Goal } from "@/lib/api/goals";

export function GoalsBoard({ token, initial }: { token: string; initial: Goal[] }) {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function onCreate() {
    if (!title.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const g = await createGoal(token, { title, description });
      setGoals((prev) => [g, ...prev]);
      setTitle("");
      setDescription("");
      setShowForm(false);
      startTransition(() => router.refresh());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function onLog(goalId: string) {
    const note = window.prompt("Quick progress note?");
    if (!note?.trim()) return;
    try {
      await logProgress(token, goalId, { note, progress: 1 });
      startTransition(() => router.refresh());
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function onDelete(goalId: string) {
    if (!window.confirm("Delete this goal?")) return;
    try {
      await deleteGoal(token, goalId);
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
      startTransition(() => router.refresh());
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div>
      <div className="row between" style={{ marginBottom: 14 }}>
        <span className="eyebrow">{goals.length} active</span>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => setShowForm((v) => !v)}
        >
          <Icon name="plus" size={14} /> {showForm ? "Cancel" : "New goal"}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="field">
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Finish chapter 7" />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does done look like?"
            />
          </div>
          {error && <div style={{ color: "var(--accent-ink)", fontSize: "var(--t-1)" }}>{error}</div>}
          <button type="button" className="btn btn-primary" onClick={onCreate} disabled={busy || !title.trim()}>
            {busy ? "Saving…" : "Create"}
          </button>
        </div>
      )}

      <div className="goals-grid">
        <div>
          {goals.length === 0 && (
            <div className="card" style={{ color: "var(--mute)" }}>
              No goals yet. Press &ldquo;New goal&rdquo; to set one.
            </div>
          )}
          {goals.map((g) => {
            const events = g.progressEvents ?? [];
            const lastNote = events[0]?.note;
            return (
              <div key={g.id} className="goal-card">
                <div className="row between" style={{ alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <span className="pill">{g.category}</span>
                    <h3 style={{ margin: "10px 0 0", fontWeight: 500, fontSize: 17 }}>{g.title}</h3>
                    {g.description && (
                      <p style={{ margin: "6px 0 0", color: "var(--mute)", fontSize: "var(--t-2)" }}>
                        {g.description}
                      </p>
                    )}
                  </div>
                  <div className="row" style={{ gap: 6 }}>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => onLog(g.id)}>
                      <Icon name="check" size={13} /> Log
                    </button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => onDelete(g.id)}>
                      <Icon name="dots" size={13} /> Delete
                    </button>
                  </div>
                </div>
                <div className="goal-stats">
                  <div>
                    <span style={{ display: "block" }}>Progress events</span>
                    <b>{g._count?.progressEvents ?? events.length}</b>
                  </div>
                  <div>
                    <span style={{ display: "block" }}>Last</span>
                    <b>{lastNote ?? "—"}</b>
                  </div>
                  <div>
                    <span style={{ display: "block" }}>Status</span>
                    <b>{g.status}</b>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GoalsBoard;
