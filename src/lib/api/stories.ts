import { env } from "@/lib/env";

export type StoryStatus = "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";
export type StoryVisibility = "PRIVATE" | "UNLISTED" | "PUBLIC";

export type StorySummary = {
  id: string;
  title?: string | null;
  synopsis?: string | null;
  status: StoryStatus;
  visibility: StoryVisibility;
  flagged: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  model: {
    id: string;
    label: string;
    identifier: string;
  };
};

export type StoryDetail = StorySummary & {
  body: string;
  tags: { id: string; key: string; value: string }[];
  versions: {
    id: string;
    createdAt: string;
    createdBy: string;
  }[];
};

type UpdateStoryInput = {
  title?: string;
  synopsis?: string;
  body?: string;
  status?: StoryStatus;
};

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchStories(): Promise<StorySummary[]> {
  const res = await fetch(`${env.publicBackendApiUrl}/stories`, {
    cache: "no-store",
    credentials: "include",
  });
  return handleResponse<StorySummary[]>(res);
}

export async function fetchStory(storyId: string): Promise<StoryDetail> {
  const res = await fetch(`${env.publicBackendApiUrl}/stories/${storyId}`, {
    cache: "no-store",
    credentials: "include",
  });
  return handleResponse<StoryDetail>(res);
}

export async function updateStory(storyId: string, data: UpdateStoryInput) {
  const res = await fetch(`${env.publicBackendApiUrl}/stories/${storyId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse<StoryDetail>(res);
}

export async function publishStory(storyId: string) {
  const res = await fetch(`${env.publicBackendApiUrl}/stories/${storyId}/publish`, {
    method: "POST",
    credentials: "include",
  });
  return handleResponse<StoryDetail>(res);
}

export async function updateStoryVisibility(storyId: string, visibility: StoryVisibility) {
  const res = await fetch(`${env.publicBackendApiUrl}/stories/${storyId}/visibility`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ visibility }),
  });
  return handleResponse<StoryDetail>(res);
}

