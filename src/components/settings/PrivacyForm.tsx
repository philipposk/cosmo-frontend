"use client";

import { useState } from "react";
import { env } from "@/lib/env";
import type { ProfileSettings } from "@/types/profile";

type PrivacyFormProps = {
  userId: string;
  profile: ProfileSettings;
};

const privacyOptions = [
  { label: "Public", value: "PUBLIC", description: "Visible to everyone on Cosmo." },
  { label: "Friends", value: "FRIENDS", description: "Visible to accepted followers and approved caretakers." },
  { label: "Private", value: "PRIVATE", description: "Visible only to you (and designated caretakers)." },
];

export const PrivacyForm = ({ userId, profile }: PrivacyFormProps) => {
  const [privacyLevel, setPrivacyLevel] = useState(profile.privacyLevel);
  const [showActivity, setShowActivity] = useState(profile.profileSettings?.showActivity ?? true);
  const [showLibraries, setShowLibraries] = useState(profile.profileSettings?.showLibraries ?? true);
  const [showBadges, setShowBadges] = useState(profile.profileSettings?.showBadges ?? true);
  const [allowMessages, setAllowMessages] = useState(profile.profileSettings?.allowMessages ?? true);
  const [allowMentions, setAllowMentions] = useState(profile.profileSettings?.allowMentions ?? true);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch(`${env.publicBackendApiUrl}/users/${userId}/privacy`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          privacyLevel,
          showActivity,
          showLibraries,
          showBadges,
          allowMessages,
          allowMentions,
        }),
      });

      if (!res.ok) {
        setStatus("error");
        return;
      }

      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Global privacy level</p>
        <div className="grid gap-4 md:grid-cols-3">
          {privacyOptions.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer flex-col rounded-2xl border p-4 shadow-sm transition ${
                privacyLevel === option.value
                  ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              <input
                type="radio"
                name="privacyLevel"
                value={option.value}
                checked={privacyLevel === option.value}
                onChange={() => setPrivacyLevel(option.value)}
                className="hidden"
              />
              <span className="text-base font-semibold">{option.label}</span>
              <span className="mt-2 text-sm">{option.description}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Visibility controls</p>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
            <div>
              <span className="text-sm font-semibold text-slate-800">Show your activity</span>
              <p className="text-xs text-slate-500">Display public posts and reactions on your profile.</p>
            </div>
            <input
              type="checkbox"
              checked={showActivity}
              onChange={(event) => setShowActivity(event.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>
          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
            <div>
              <span className="text-sm font-semibold text-slate-800">Show your libraries</span>
              <p className="text-xs text-slate-500">Expose books, comics, and audio collections.</p>
            </div>
            <input
              type="checkbox"
              checked={showLibraries}
              onChange={(event) => setShowLibraries(event.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>
          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
            <div>
              <span className="text-sm font-semibold text-slate-800">Display badges</span>
              <p className="text-xs text-slate-500">Highlight achievements, certifications, and care levels.</p>
            </div>
            <input
              type="checkbox"
              checked={showBadges}
              onChange={(event) => setShowBadges(event.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>
          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
            <div>
              <span className="text-sm font-semibold text-slate-800">Allow direct messages</span>
              <p className="text-xs text-slate-500">Permit approved connections to reach out.</p>
            </div>
            <input
              type="checkbox"
              checked={allowMessages}
              onChange={(event) => setAllowMessages(event.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>
          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
            <div>
              <span className="text-sm font-semibold text-slate-800">Allow mentions</span>
              <p className="text-xs text-slate-500">Let friends tag you in posts and forums.</p>
            </div>
            <input
              type="checkbox"
              checked={allowMentions}
              onChange={(event) => setAllowMentions(event.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Configure granular overrides per follower in the social graph module (coming soon).
        </p>
        <button
          type="submit"
          className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={status === "saving"}
        >
          {status === "saving" ? "Saving..." : "Save privacy"}
        </button>
      </div>
      {status === "saved" && <p className="text-sm text-emerald-600">Privacy settings updated.</p>}
      {status === "error" && <p className="text-sm text-rose-600">Unable to update privacy settings.</p>}
    </form>
  );
};

