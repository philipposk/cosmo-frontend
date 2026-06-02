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

export function deleteGoal(token: string, goalId: string) {
  return apiFetch(`/goals/${goalId}`, { method: "DELETE", token });
}
