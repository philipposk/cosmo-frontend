import { env } from "@/lib/env";

export type AIJobStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

export type AIJob = {
  id: string;
  userId: string;
  prompt: string;
  tone?: string | null;
  genre?: string | null;
  safetyLevel?: string | null;
  status: AIJobStatus;
  errorMessage?: string | null;
  priority: number;
  queuedAt: string;
  startedAt?: string | null;
  completedAt?: string | null;
  resultStory?: {
    id: string;
    title?: string | null;
    status: string;
    visibility: string;
  } | null;
  model: ModelProvider;
};

export type ModelProvider = {
  id: string;
  label: string;
  identifier: string;
  description?: string | null;
  family?: string | null;
  maxWords: number;
  baseCostUSD?: number | null;
};

type CreateJobInput = {
  prompt: string;
  tone?: string;
  genre?: string;
  safetyLevel?: string;
  modelIdentifier: string;
  tags?: string[];
};

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function createAIJob(input: CreateJobInput, token?: string): Promise<AIJob> {
  const res = await fetch(`${env.publicBackendApiUrl}/ai-jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify(input),
  });

  return handleResponse<AIJob>(res);
}

export async function fetchAIJobs(token?: string): Promise<AIJob[]> {
  const res = await fetch(`${env.publicBackendApiUrl}/ai-jobs`, {
    cache: "no-store",
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return handleResponse<AIJob[]>(res);
}

export async function fetchAIJob(jobId: string, token?: string): Promise<AIJob> {
  const res = await fetch(`${env.publicBackendApiUrl}/ai-jobs/${jobId}`, {
    cache: "no-store",
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return handleResponse<AIJob>(res);
}

export async function fetchModelCatalog(token?: string): Promise<ModelProvider[]> {
  const res = await fetch(`${env.publicBackendApiUrl}/ai-jobs/catalog/models`, {
    cache: "no-store",
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return handleResponse<ModelProvider[]>(res);
}

