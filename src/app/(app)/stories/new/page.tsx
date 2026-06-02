import "server-only";
import Link from "next/link";
import { getServerSession } from "@/lib/auth/server";

import { StoryComposer } from "@/components/stories/StoryComposer";
import { env } from "@/lib/env";
import type { ModelProvider } from "@/lib/api/ai-jobs";
import type { UserMembership } from "@/lib/api/membership";
import { GuestPrompt } from "@/components/common/GuestPrompt";

const DEFAULT_MAX_WORDS = 1000;

async function fetchModels(token: string): Promise<ModelProvider[]> {
  const res = await fetch(`${env.backendApiUrl}/ai-jobs/catalog/models`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Failed to load model catalog");
  }

  return res.json();
}

async function fetchMembership(token: string): Promise<UserMembership | null> {
  const res = await fetch(`${env.backendApiUrl}/membership/me`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Failed to load membership");
  }

  return res.json();
}

export default async function NewStoryPage() {
  const session = await getServerSession();
  const token = session?.user?.token ?? null;

  if (!token) {
    return (
      <div>
        <div className="page-head">
          <div>
            <div className="eyebrow">AI Studio</div>
            <h1 className="display">New story</h1>
          </div>
        </div>
        <GuestPrompt action="create and generate stories" callbackUrl="/stories/new" />
      </div>
    );
  }

  const [models, membership] = await Promise.all([
    fetchModels(token),
    fetchMembership(token),
  ]);
  const maxWords = membership?.tier.maxWordsPerStory ?? DEFAULT_MAX_WORDS;
  const defaultModelIdentifier = membership?.tier.availableModels?.[0] ?? models[0]?.identifier;

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">AI studio</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Compose a new story</h1>
        <p className="mt-3 text-sm text-slate-600">
          Provide a short prompt and select your preferred tone, genre, and model. Cosmo will generate a ~1000 word draft
          you can refine before publishing.
        </p>
        <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-700">
          <p>
            Daily quota:{" "}
            <span className="font-semibold text-indigo-900">
              {membership?.tier.maxStoriesPerDay ?? 3} stories / {membership?.tier.name ?? "Free plan"}
            </span>
            . Need more? Upgrade via{" "}
            <Link href="/membership" className="text-indigo-600 underline">
              Membership settings
            </Link>
            .
          </p>
        </div>
      </header>

      {models.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
          No models are configured yet. Ask an administrator to add provider keys in the deployment configuration.
        </div>
      ) : (
        <StoryComposer
          models={models}
          defaultModelIdentifier={defaultModelIdentifier}
          maxWords={maxWords}
        />
      )}
    </div>
  );
}

