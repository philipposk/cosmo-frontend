import { env } from "@/lib/env";
import type { ThreadDetail } from "@/lib/api/forums";
import { ReplyForm } from "@/components/forums/ReplyForm";
import { ForumThreadView } from "@/components/forums/ForumThreadView";
import { getServerSession } from "@/lib/auth/server";

type Props = { params: Promise<{ slug: string; threadId: string }> };

async function load(threadId: string): Promise<ThreadDetail | null> {
  try {
    const res = await fetch(`${env.backendApiUrl}/forums/threads/${threadId}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as ThreadDetail;
  } catch {
    return null;
  }
}

export default async function ThreadPage({ params }: Props) {
  const { slug, threadId } = await params;
  const [thread, session] = await Promise.all([load(threadId), getServerSession()]);
  if (!thread) {
    return <div className="card">Thread not found.</div>;
  }

  return (
    <div>
      <ForumThreadView
        thread={thread}
        slug={slug}
        currentUserId={session?.user?.id ?? null}
        roles={session?.user?.roles ?? []}
        token={session?.user?.token ?? null}
      />

      <div style={{ marginTop: 18 }}>
        <ReplyForm threadId={threadId} />
      </div>
    </div>
  );
}
