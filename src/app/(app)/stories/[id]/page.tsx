import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { StoryEditor } from "@/components/stories/StoryEditor";
import { env } from "@/lib/env";
import type { StoryDetail } from "@/lib/api/stories";

async function fetchStory(storyId: string): Promise<StoryDetail | null> {
  const res = await fetch(`${env.backendApiUrl}/stories/${storyId}`, {
    cache: "no-store",
    headers: {
      cookie: cookies().toString(),
    },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Failed to load story");
  }

  return res.json();
}

type StoryPageProps = {
  params: { id: string };
};

export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = params;
  const story = await fetchStory(id);

  if (!story) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Story editor</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">{story.title ?? "Untitled story"}</h1>
        <p className="mt-3 text-sm text-slate-600">
          Fine-tune the generated draft, adjust tone, and publish when you&apos;re ready. All changes are versioned so
          you can roll back at any time.
        </p>
      </header>

      <StoryEditor story={story} />
    </div>
  );
}

