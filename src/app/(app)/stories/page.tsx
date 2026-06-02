import "server-only";
import Link from "next/link";
import { getServerSession } from "@/lib/auth/server";

import { env } from "@/lib/env";
import type { StorySummary } from "@/lib/api/stories";
import { GuestPrompt } from "@/components/common/GuestPrompt";
import { Icon } from "@/components/common/Icon";

async function fetchStories(token: string): Promise<StorySummary[]> {
  const res = await fetch(`${env.backendApiUrl}/stories`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Failed to load stories");
  }

  return res.json();
}

export default async function StoriesPage() {
  const session = await getServerSession();
  const token = session?.user?.token ?? null;
  const stories = token ? await fetchStories(token) : [];

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">AI Studio</div>
          <h1 className="display">Stories</h1>
          <p className="sub">Draft alone or with AI. Every story tracks its model, tone, and safety settings.</p>
        </div>
        <div className="page-actions">
          <Link href="/stories/new" className="btn btn-primary">
            <Icon name="plus" size={14} /> New story
          </Link>
        </div>
      </div>

      {!token && (
        <div style={{ marginBottom: 22 }}>
          <GuestPrompt action="write and manage stories" callbackUrl="/stories" />
        </div>
      )}

      <section className="grid gap-4">
        {token && stories.length === 0 ? (
          <div className="card" style={{ color: "var(--mute)", textAlign: "center", padding: 40 }}>
            No stories yet. Start with a prompt in AI Studio.
          </div>
        ) : token ? (
          stories.map((story) => (
            <Link
              key={story.id}
              href={`/stories/${story.id}`}
              className="group block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {story.title || "Untitled story"}{" "}
                    <span className="ml-2 text-sm font-medium uppercase tracking-wide text-indigo-600">
                      {story.status}
                    </span>
                  </h2>
                  {story.synopsis ? (
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">{story.synopsis}</p>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">Generated via {story.model.label}</p>
                  )}
                </div>
                <div className="text-right text-sm text-slate-500">
                  <p className="font-medium text-slate-700">Visibility: {story.visibility}</p>
                  <p>
                    Updated{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(story.updatedAt))}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : null}
      </section>
    </div>
  );
}

