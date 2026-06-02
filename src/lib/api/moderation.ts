import { apiFetch } from "./client";

export type FlaggedStory = {
  id: string;
  title: string | null;
  synopsis: string | null;
  body: string;
  flagged: boolean;
  status: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";
  visibility: "PRIVATE" | "UNLISTED" | "PUBLIC";
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    displayName: string;
  };
  model: { identifier: string; label: string } | null;
  tags: Array<{ id: string; key: string; value: string }>;
};

export type Decision = "APPROVED" | "FLAGGED" | "REMOVED";

export function listFlagged(token: string) {
  return apiFetch<FlaggedStory[]>("/moderation/stories/flagged", { token });
}

export function moderateStory(
  token: string,
  id: string,
  payload: { decision: Decision; statusOverride?: string },
) {
  return apiFetch<FlaggedStory>(`/moderation/stories/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}
