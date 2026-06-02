"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ModelProvider } from "@/lib/api/ai-jobs";
import { createAIJob } from "@/lib/api/ai-jobs";
import { useSession } from "@/lib/auth/session";

type StoryComposerProps = {
  models: ModelProvider[];
  defaultModelIdentifier?: string;
  maxWords: number;
};

export function StoryComposer({ models, defaultModelIdentifier, maxWords }: StoryComposerProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("");
  const [genre, setGenre] = useState("");
  const [safety, setSafety] = useState("balanced");
  const [model, setModel] = useState(defaultModelIdentifier ?? models[0]?.identifier ?? "");
  const [tags, setTags] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      setError(null);
      setSuccess(null);

      try {
        if (!session?.user?.token) {
          throw new Error("You need to sign in again before generating a story.");
        }
        await createAIJob({
          prompt,
          tone: tone || undefined,
          genre: genre || undefined,
          safetyLevel: safety,
          modelIdentifier: model,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }, session.user.token);
        setSuccess("Story generation started! Redirecting to your stories.");
        setPrompt("");
        setTimeout(() => {
          router.push(`/stories`);
        }, 1200);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to submit story job");
      }
    });
  };

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <label className="block text-sm font-medium text-slate-700">Prompt</label>
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          className="mt-2 h-48 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
          placeholder="Write a short prompt to generate a ~1000 word story…"
        />
        <p className="mt-1 text-xs text-slate-500">We recommend concise prompts that describe tone, characters, and arc.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-slate-700">Tone</label>
          <input
            value={tone}
            onChange={(event) => setTone(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            placeholder="Hopeful, dark academia, whimsical..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Genre</label>
          <input
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            placeholder="Sci-fi, mystery, romance..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Safety profile</label>
          <select
            value={safety}
            onChange={(event) => setSafety(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
          >
            <option value="strict">Strict</option>
            <option value="balanced">Balanced</option>
            <option value="creative">Creative</option>
          </select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Model</label>
          <select
            value={model}
            onChange={(event) => setModel(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
          >
            {models.map((option) => (
              <option key={option.id} value={option.identifier}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">More advanced tiers unlock additional models.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Tags</label>
          <input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            placeholder="Comma-separated tags (e.g. bedtime, short-form, adventure)"
          />
        </div>
      </div>
      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        <p>
          Stories are limited to <span className="font-semibold text-slate-800">{maxWords.toLocaleString()} words</span>{" "}
          for your current plan. Publishing will let you share publicly or keep the story private.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleSubmit}
          disabled={isPending || !prompt.trim()}
          className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isPending ? "Submitting…" : "Generate story"}
        </button>
        <button
          type="button"
          onClick={() => {
            setPrompt("");
            setTone("");
            setGenre("");
            setTags("");
            setSafety("balanced");
            setModel(defaultModelIdentifier ?? models[0]?.identifier ?? "");
          }}
          className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
        >
          Reset
        </button>
      </div>
      {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}

