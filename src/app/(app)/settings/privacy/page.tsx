import { PrivacyForm } from "@/components/settings/PrivacyForm";
import { getServerSession } from "@/lib/auth/server";
import { env } from "@/lib/env";
import type { ProfileSettings } from "@/types/profile";
import { redirect } from "next/navigation";

async function loadProfile(username: string): Promise<ProfileSettings | null> {
  const res = await fetch(`${env.backendApiUrl}/users/${username}`, { cache: "no-store" });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export default async function PrivacySettingsPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  const profile = await loadProfile(session.user.username);
  if (!profile) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Safety & Controls</p>
        <h1 className="text-3xl font-bold text-slate-900">Privacy settings</h1>
        <p className="text-slate-600">
          Decide who can see your libraries, goals, and activity. Advanced overrides for zones and followers are coming
          soon.
        </p>
      </header>
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <PrivacyForm userId={session.user.id} token={session.user.token ?? ""} profile={profile} />
      </div>
    </div>
  );
}

