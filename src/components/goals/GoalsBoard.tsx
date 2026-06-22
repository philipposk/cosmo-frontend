"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/common/Icon";
import {
  createGoal,
  deleteGoal,
  goalProgressPct,
  logProgress,
  setGoalStatus,
  type Goal,
} from "@/lib/api/goals";

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

  async function onLog(goal: Goal) {
    const note = window.prompt("Quick progress note?");
    if (!note?.trim()) return;
    const current = goalProgressPct(goal);
    const pctRaw = window.prompt(`Progress so far (0–100%)?`, String(current));
    if (pctRaw === null) return;
    const progress = Math.max(0, Math.min(100, Number(pctRaw) || current));
    try {
      await logProgress(token, goal.id, { note, progress });
      startTransition(() => router.refresh());
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function onToggleComplete(goal: Goal) {
    const next = goal.status === "COMPLETED" ? "ACTIVE" : "COMPLETED";
    try {
      const updated = await setGoalStatus(token, goal.id, next);
      setGoals((prev) => prev.map((g) => (g.id === goal.id ? { ...g, status: updated.status } : g)));
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
        <span className="eyebrow">
          {goals.filter((g) => g.status !== "COMPLETED").length} active ·{" "}
          {goals.filter((g) => g.status === "COMPLETED").length} done
        </span>
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
            const pct = goalProgressPct(g);
            const done = g.status === "COMPLETED";
            return (
              <div key={g.id} className="goal-card" style={done ? { opacity: 0.7 } : undefined}>
                <div className="row between" style={{ alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <span className="pill">{g.category}</span>
                    <h3
                      style={{
                        margin: "10px 0 0",
                        fontWeight: 500,
                        fontSize: 17,
                        textDecoration: done ? "line-through" : "none",
                      }}
                    >
                      {g.title}
                    </h3>
                    {g.description && (
                      <p style={{ margin: "6px 0 0", color: "var(--mute)", fontSize: "var(--t-2)" }}>
                        {g.description}
                      </p>
                    )}
                  </div>
                  <div className="row" style={{ gap: 6 }}>
                    {!done && (
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => onLog(g)}>
                        <Icon name="check" size={13} /> Log
                      </button>
                    )}
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => onToggleComplete(g)}>
                      {done ? "Reopen" : "Complete"}
                    </button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => onDelete(g.id)}>
                      <Icon name="dots" size={13} /> Delete
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ margin: "12px 0 4px" }}>
                  <div
                    style={{
                      height: 8,
                      borderRadius: 99,
                      background: "var(--line)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: done ? "var(--cool, var(--accent))" : "var(--accent)",
                        transition: "width 0.3s",
                      }}
                    />
                  </div>
                  <div style={{ fontSize: "var(--t-1)", color: "var(--mute)", marginTop: 4 }}>
                    {pct}% · {g._count?.progressEvents ?? events.length} updates
                    {lastNote ? ` · last: ${lastNote}` : ""}
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
