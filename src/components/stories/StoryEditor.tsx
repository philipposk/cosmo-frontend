"use client";

import { useMemo, useState, useTransition } from "react";
import type { StoryDetail, StoryStatus, StoryVisibility } from "@/lib/api/stories";
import { publishStory, updateStory, updateStoryVisibility } from "@/lib/api/stories";

type StoryEditorProps = {
  story: StoryDetail;
};

export function StoryEditor({ story }: StoryEditorProps) {
  const [title, setTitle] = useState(story.title ?? "");
  const [synopsis, setSynopsis] = useState(story.synopsis ?? "");
  const [body, setBody] = useState(story.body);
  const [status, setStatus] = useState<StoryStatus>(story.status);
  const [visibility, setVisibility] = useState<StoryVisibility>(story.visibility);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const statusOptions = useMemo<StoryStatus[]>(() => ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"], []);
  const visibilityOptions = useMemo<StoryVisibility[]>(() => ["PRIVATE", "UNLISTED", "PUBLIC"], []);

  const handleSave = () => {
    startTransition(async () => {
      setError(null);
      setSuccess(null);
      try {
        const updated = await updateStory(story.id, {
          title,
          synopsis,
          body,
          status,
        });
        setSuccess("Draft saved");
        setStatus(updated.status);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to save story");
      }
    });
  };

  const handlePublish = () => {
    startTransition(async () => {
      setError(null);
      setSuccess(null);
      try {
        const updated = await publishStory(story.id);
        setStatus(updated.status);
        setVisibility(updated.visibility);
        setSuccess("Story published");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to publish story");
      }
    });
  };

  const handleVisibilityChange = (next: StoryVisibility) => {
    startTransition(async () => {
      setError(null);
      setSuccess(null);
      try {
        const updated = await updateStoryVisibility(story.id, next);
        setVisibility(updated.visibility);
        setSuccess("Visibility updated");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to update visibility");
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            placeholder="A thousand stars over the sea"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Synopsis</label>
          <textarea
            value={synopsis}
            onChange={(event) => setSynopsis(event.target.value)}
            className="mt-2 h-24 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            placeholder="A quick summary of your story."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Story body</label>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="mt-2 h-96 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm leading-6 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            placeholder="Write or refine your story here…"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            Save draft
          </button>
          <button
            onClick={handlePublish}
            disabled={isPending || status === "PUBLISHED"}
            className="rounded-full border border-indigo-200 bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            Publish
          </button>
        </div>
        {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </div>

      <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Status</h3>
          <select
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            value={status}
            onChange={(event) => setStatus(event.target.value as StoryStatus)}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Visibility</h3>
          <select
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            value={visibility}
            onChange={(event) => handleVisibilityChange(event.target.value as StoryVisibility)}
          >
            {visibilityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Metadata</h3>
          <dl className="mt-3 space-y-2 text-sm text-slate-600">
            <div>
              <dt className="font-medium text-slate-700">Model</dt>
              <dd>{story.model.label}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700">Updated</dt>
              <dd>{new Date(story.updatedAt).toLocaleString()}</dd>
            </div>
            {story.tags.length ? (
              <div>
                <dt className="font-medium text-slate-700">Tags</dt>
                <dd className="flex flex-wrap gap-2">
                  {story.tags.map((tag) => (
                    <span key={tag.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {tag.key}: {tag.value}
                    </span>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Versions</h3>
          <ul className="mt-3 space-y-2 text-xs text-slate-600">
            {story.versions.map((version) => (
              <li key={version.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                Saved {new Date(version.createdAt).toLocaleString()} by {version.createdBy}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

