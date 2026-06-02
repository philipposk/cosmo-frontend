import { getServerSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import type { FlaggedStory } from "@/lib/api/moderation";
import { ModerationBoard } from "@/components/admin/ModerationBoard";

async function loadFlagged(token: string): Promise<FlaggedStory[]> {
  try {
    const res = await fetch(`${env.backendApiUrl}/moderation/stories/flagged`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    return (await res.json()) as FlaggedStory[];
  } catch {
    return [];
  }
}

export default async function ModerationPage() {
  const session = await getServerSession();
  if (!session?.user?.token) {
    redirect("/login?callbackUrl=" + encodeURIComponent("/admin/moderation"));
  }

  const roles = session.user.roles ?? [];
  const isAllowed = roles.includes("ADMIN") || roles.includes("MOD");
  if (!isAllowed) {
    return (
      <div>
        <div className="page-head">
          <div>
            <div className="eyebrow">Restricted</div>
            <h1 className="display">Admin only</h1>
            <p className="sub">You need the ADMIN or MOD role to view this page.</p>
          </div>
        </div>
      </div>
    );
  }

  const flagged = await loadFlagged(session.user.token);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Moderation</div>
          <h1 className="display">Flagged stories</h1>
          <p className="sub">Review automated and reported flags. Approve to clear, remove to take the story offline.</p>
        </div>
      </div>
      <ModerationBoard token={session.user.token} initial={flagged} />
    </div>
  );
}
