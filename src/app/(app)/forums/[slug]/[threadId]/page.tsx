import Link from "next/link";
import { env } from "@/lib/env";
import type { ThreadDetail } from "@/lib/api/forums";
import { ReplyForm } from "@/components/forums/ReplyForm";

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

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default async function ThreadPage({ params }: Props) {
  const { slug, threadId } = await params;
  const thread = await load(threadId);
  if (!thread) {
    return <div className="card">Thread not found.</div>;
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">
            <Link href="/forums">Forums</Link> · <Link href={`/forums/${slug}`}>{thread.forum.name}</Link>
          </div>
          <h1 className="display">{thread.title}</h1>
          <p className="sub">by @{thread.author.username} · {timeAgo(thread.createdAt)}</p>
        </div>
      </div>

      <article className="post">
        <p className="post-body" style={{ whiteSpace: "pre-wrap" }}>{thread.body}</p>
      </article>

      <div style={{ marginTop: 18 }}>
        {thread.replies.map((r) => (
          <article key={r.id} className="post">
            <div className="row" style={{ gap: 10, marginBottom: 6 }}>
              <b style={{ fontWeight: 500 }}>{r.author.displayName}</b>
              <span className="meta">@{r.author.username} · {timeAgo(r.createdAt)}</span>
            </div>
            <p className="post-body" style={{ whiteSpace: "pre-wrap" }}>{r.content}</p>
          </article>
        ))}
      </div>

      <div style={{ marginTop: 18 }}>
        <ReplyForm threadId={threadId} />
      </div>
    </div>
  );
}
