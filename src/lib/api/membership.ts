import { env } from "@/lib/env";

export type MembershipTier = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  priceCents: number;
  currency: string;
  maxStoriesPerDay: number;
  maxWordsPerStory: number;
  priorityLevel: number;
  availableModels: string[];
  stripePriceId?: string | null;
};

export type UserMembership = {
  id: string;
  status: "ACTIVE" | "PAST_DUE" | "CANCELLED";
  trialEndsAt?: string | null;
  currentPeriodEnd?: string | null;
  tier: MembershipTier;
};

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchMembershipTiers(token?: string): Promise<MembershipTier[]> {
  const res = await fetch(`${env.publicBackendApiUrl}/membership/tiers`, {
    cache: "no-store",
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return handleResponse<MembershipTier[]>(res);
}

export async function fetchUserMembership(token?: string): Promise<UserMembership | null> {
  const res = await fetch(`${env.publicBackendApiUrl}/membership/me`, {
    cache: "no-store",
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 404) {
    return null;
  }

  return handleResponse<UserMembership | null>(res);
}

export async function createCheckoutSession(input: {
  tierSlug: string;
  successUrl?: string;
  cancelUrl?: string;
}, token?: string): Promise<{ url?: string; id?: string }> {
  const res = await fetch(`${env.publicBackendApiUrl}/membership/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify(input),
  });

  return handleResponse<{ url?: string; id?: string }>(res);
}

