import { env } from "@/lib/env";
import { notFound } from "next/navigation";
import { getServerSession } from "@/lib/auth/server";
import { FollowButton } from "@/components/social/FollowButton";

async function fetchProfile(username: string) {
  const res = await fetch(`${env.backendApiUrl}/users/${username}`, { cache: "no-store" });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

async function fetchStatus(viewerId: string, targetId: string) {
  const res = await fetch(
    `${env.backendApiUrl}/social/status?viewerId=${viewerId}&targetId=${targetId}`,
    { cache: "no-store" },
  );
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const session = await getServerSession();
  const profile = await fetchProfile(params.username);

  if (!profile) {
    notFound();
  }

  const isOwner = session?.user?.id === profile.id;
  const status = !isOwner && session?.user ? await fetchStatus(session.user.id, profile.id) : null;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="h-48 bg-gradient-to-r from-indigo-300 via-sky-200 to-violet-200" />
        <div className="space-y-4 px-8 pb-8">
          <div className="-mt-16 inline-flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-indigo-600 text-3xl font-bold text-white shadow-lg">
            {profile.displayName[0]?.toUpperCase()}
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-slate-900">{profile.displayName}</h1>
            <p className="text-sm text-slate-500">@{profile.username}</p>
            {profile.bio && <p className="max-w-2xl text-slate-600">{profile.bio}</p>}
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-700">Privacy: {profile.privacyLevel}</span>
            {profile.roles.map((role: string) => (
              <span key={role} className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                {role}
              </span>
            ))}
          </div>
          {!isOwner && session?.user && (
            <FollowButton
              currentUserId={session.user.id}
              targetUserId={profile.id}
              initialFollowStatus={status?.followStatus ?? null}
              initialFriendshipStatus={status?.friendshipStatus ?? null}
              initialFriendshipId={status?.friendshipId ?? null}
            />
          )}
        </div>
      </section>
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Visibility preferences</h2>
          <dl className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <dt>Show activity</dt>
              <dd>{profile.profileSettings?.showActivity ? "Enabled" : "Hidden"}</dd>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <dt>Show libraries</dt>
              <dd>{profile.profileSettings?.showLibraries ? "Enabled" : "Hidden"}</dd>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <dt>Show badges</dt>
              <dd>{profile.profileSettings?.showBadges ? "Visible" : "Hidden"}</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">About</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>Age gate status: {profile.ageGateStatus}</li>
            <li>Parental control level: {profile.parentalControlLevel ?? "Not set"}</li>
            <li>
              Messaging: {profile.profileSettings?.allowMessages ? "Open to messages" : "Messages disabled"}
            </li>
            <li>Mentions: {profile.profileSettings?.allowMentions ? "Allowed" : "Muted"}</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

