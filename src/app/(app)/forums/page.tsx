import Link from "next/link";
import { env } from "@/lib/env";
import { Icon } from "@/components/common/Icon";
import type { Forum } from "@/lib/api/forums";

async function loadForums(): Promise<Forum[]> {
  try {
    const res = await fetch(`${env.backendApiUrl}/forums`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as Forum[];
  } catch {
    return [];
  }
}

export default async function ForumsPage() {
  const forums = await loadForums();
  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Community</div>
          <h1 className="display">Forums</h1>
          <p className="sub">Quiet, threaded spaces for craft, critique, and care. Pick a room and start a thread.</p>
        </div>
      </div>

      <div className="forum-list">
        {forums.length === 0 && (
          <div style={{ padding: 22, color: "var(--mute)" }}>No forums yet — check back in a moment.</div>
        )}
        {forums.map((f) => (
          <Link key={f.id} className="forum-row" href={`/forums/${f.slug}`}>
            <div>
              <h4>{f.name}</h4>
              <div className="desc">{f.description}</div>
            </div>
            <div className="num">
              <span>Threads</span>
              {f._count?.threads ?? 0}
            </div>
            <div className="num">
              <span>Slug</span>
              {f.slug}
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
