"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { env } from "@/lib/env";
import type { ProfileSettings } from "@/types/profile";

const schema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  bio: z.string().max(2800, "Bio must be under 2800 characters").optional().or(z.literal("")),
  location: z.string().max(120, "Location must be under 120 characters").optional().or(z.literal("")),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  pronouns: z.string().max(40, "Pronouns should be short").optional().or(z.literal("")),
  avatarUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  coverUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

type ProfileFormProps = {
  userId: string;
  token: string;
  profile: ProfileSettings;
};

export const ProfileForm = ({ userId, token, profile }: ProfileFormProps) => {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: profile.displayName,
      bio: profile.bio ?? "",
      location: profile.location ?? "",
      website: profile.website ?? "",
      pronouns: profile.pronouns ?? "",
      avatarUrl: profile.avatarUrl ?? "",
      coverUrl: profile.coverUrl ?? "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setStatus("saving");
    try {
      const res = await fetch(`${env.publicBackendApiUrl}/users/${userId}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...values,
          bio: values.bio || undefined,
          location: values.location || undefined,
          website: values.website || undefined,
          pronouns: values.pronouns || undefined,
          avatarUrl: values.avatarUrl || undefined,
          coverUrl: values.coverUrl || undefined,
        }),
      });

      if (!res.ok) {
        setStatus("error");
        return;
      }

      const updated = (await res.json()) as ProfileSettings;
      reset({
        displayName: updated.displayName,
        bio: updated.bio ?? "",
        location: updated.location ?? "",
        website: updated.website ?? "",
        pronouns: updated.pronouns ?? "",
        avatarUrl: updated.avatarUrl ?? "",
        coverUrl: updated.coverUrl ?? "",
      });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="displayName">
            Display name
          </label>
          <input
            id="displayName"
            type="text"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            {...register("displayName")}
          />
          {errors.displayName && <p className="text-sm text-rose-600">{errors.displayName.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="pronouns">
            Pronouns
          </label>
          <input
            id="pronouns"
            type="text"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            {...register("pronouns")}
          />
          {errors.pronouns && <p className="text-sm text-rose-600">{errors.pronouns.message}</p>}
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            rows={4}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            {...register("bio")}
          />
          {errors.bio && <p className="text-sm text-rose-600">{errors.bio.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="location">
            Location
          </label>
          <input
            id="location"
            type="text"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            {...register("location")}
          />
          {errors.location && <p className="text-sm text-rose-600">{errors.location.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="website">
            Website
          </label>
          <input
            id="website"
            type="url"
            placeholder="https://"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            {...register("website")}
          />
          {errors.website && <p className="text-sm text-rose-600">{errors.website.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="avatarUrl">
            Avatar URL
          </label>
          <input
            id="avatarUrl"
            type="url"
            placeholder="https://storage.example/avatar.png"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            {...register("avatarUrl")}
          />
          {errors.avatarUrl && <p className="text-sm text-rose-600">{errors.avatarUrl.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="coverUrl">
            Cover image URL
          </label>
          <input
            id="coverUrl"
            type="url"
            placeholder="https://storage.example/cover.png"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            {...register("coverUrl")}
          />
          {errors.coverUrl && <p className="text-sm text-rose-600">{errors.coverUrl.message}</p>}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          These details display on your public profile and influence feed recommendations.
        </p>
        <button
          type="submit"
          className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={status === "saving"}
        >
          {status === "saving" ? "Saving..." : "Save profile"}
        </button>
      </div>
      {status === "saved" && <p className="text-sm text-emerald-600">Profile updated successfully.</p>}
      {status === "error" && <p className="text-sm text-rose-600">Unable to save profile. Please try again.</p>}
    </form>
  );
};

