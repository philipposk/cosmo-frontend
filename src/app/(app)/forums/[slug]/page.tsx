import Link from "next/link";
import { env } from "@/lib/env";
import { Icon } from "@/components/common/Icon";
import { NewThreadForm } from "@/components/forums/NewThreadForm";
import type { ForumThread } from "@/lib/api/forums";

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string): Promise<{ name: string; threads: ForumThread[] }> {
  try {
    const [forumsRes, threadsRes] = await Promise.all([
      fetch(`${env.backendApiUrl}/forums`, { cache: "no-store" }),
      fetch(`${env.backendApiUrl}/forums/${slug}/threads`, { cache: "no-store" }),
    ]);
    const forums = forumsRes.ok ? ((await forumsRes.json()) as Array<{ slug: string; name: string }>) : [];
    const threads = threadsRes.ok ? ((await threadsRes.json()) as ForumThread[]) : [];
    return {
      name: forums.find((f) => f.slug === slug)?.name ?? slug,
      threads,
    };
  } catch {
    return { name: slug, threads: [] };
  }
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export default async function ForumPage({ params }: Props) {
  const { slug } = await params;
  const { name, threads } = await load(slug);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">
            <Link href="/forums">Forums</Link> · {slug}
          </div>
          <h1 className="display">{name}</h1>
        </div>
      </div>

      <NewThreadForm slug={slug} />

      <div className="forum-list" style={{ marginTop: 18 }}>
        {threads.length === 0 && (
          <div style={{ padding: 22, color: "var(--mute)" }}>No threads yet. Start one above.</div>
        )}
        {threads.map((t) => (
          <Link key={t.id} className="forum-row" href={`/forums/${slug}/${t.id}`}>
            <div>
              <h4>{t.title}</h4>
              <div className="desc">by @{t.author.username} · {timeAgo(t.createdAt)}</div>
            </div>
            <div className="num">
              <span>Replies</span>
              {t._count?.replies ?? t.replyCount ?? 0}
            </div>
            <div className="num">
              <span>Updated</span>
              {timeAgo(t.updatedAt)}
            </div>
            <div style={{ textAlign: "right" }}>
              <Icon name="arrow" size={16} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
