import { apiFetch } from "./client";

export type Goal = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  targetDate: string | null;
  createdAt: string;
  _count?: { progressEvents: number };
  progressEvents?: Array<{ id: string; note: string; progress: number; createdAt: string }>;
};

export function listGoals(token: string) {
  return apiFetch<Goal[]>("/goals", { token });
}

export function createGoal(
  token: string,
  payload: { title: string; description?: string; targetDate?: string },
) {
  return apiFetch<Goal>("/goals", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function logProgress(
  token: string,
  goalId: string,
  payload: { note: string; progress?: number },
) {
  return apiFetch(`/goals/${goalId}/progress`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function setGoalStatus(
  token: string,
  goalId: string,
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED",
) {
  return apiFetch<Goal>(`/goals/${goalId}/status`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ status }),
  });
}

export function deleteGoal(token: string, goalId: string) {
  return apiFetch(`/goals/${goalId}`, { method: "DELETE", token });
}

/** Current completion % = the most recent progress event's value (0–100). */
export function goalProgressPct(goal: Goal): number {
  const latest = goal.progressEvents?.[0]?.progress;
  if (goal.status === "COMPLETED") return 100;
  return Math.max(0, Math.min(100, latest ?? 0));
}
