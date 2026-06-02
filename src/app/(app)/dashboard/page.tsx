import Link from "next/link";
import { getServerSession } from "@/lib/auth/server";
import { env } from "@/lib/env";
import { FeedFilters } from "@/components/dashboard/FeedFilters";
import { Composer } from "@/components/feed/Composer";
import { PostCard } from "@/components/feed/PostCard";
import { Icon } from "@/components/common/Icon";
import type { FeedPage } from "@/lib/api/feed";

type UserProfile = {
  id: string;
  username: string;
  displayName: string;
  bio?: string | null;
  privacyLevel: string;
  roles: string[];
  profileSettings?: Record<string, boolean> | null;
};

async function fetchProfile(username: string): Promise<UserProfile | null> {
  try {
    const res = await fetch(`${env.backendApiUrl}/users/${username}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as UserProfile;
  } catch {
    return null;
  }
}

async function fetchFeedSSR(token: string): Promise<FeedPage> {
  try {
    const res = await fetch(`${env.backendApiUrl}/feed`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { items: [], nextCursor: null };
    return (await res.json()) as FeedPage;
  } catch {
    return { items: [], nextCursor: null };
  }
}

async function fetchTrending(): Promise<Array<{ tag: string; count: number }>> {
  try {
    const res = await fetch(`${env.backendApiUrl}/feed/trending-tags`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as Array<{ tag: string; count: number }>;
  } catch {
    return [];
  }
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Still up,";
  if (h < 12) return "Good morning,";
  if (h < 17) return "Good afternoon,";
  if (h < 22) return "Good evening,";
  return "Late night,";
}

function initialsFor(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function DashboardPage() {
  const session = await getServerSession();
  const token = session?.user?.token ?? "";
  const [profile, feed, trending] = await Promise.all([
    session?.user?.username ? fetchProfile(session.user.username) : Promise.resolve(null),
    token ? fetchFeedSSR(token) : Promise.resolve<FeedPage>({ items: [], nextCursor: null }),
    fetchTrending(),
  ]);

  const displayName = profile?.displayName ?? session?.user?.displayName ?? "Guest";
  const firstName = displayName === "Guest" ? "there" : displayName.split(/\s+/)[0];
  const initials = initialsFor(displayName);
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">{today}</div>
          <h1 className="display">
            {greeting()} <em>{firstName}.</em>
          </h1>
          <p className="sub">
            {feed.items.length === 0
              ? "Your feed is quiet. Post something, follow other creators, or open AI Studio to start a draft."
              : "Here&apos;s what your circle is sharing today."}
          </p>
        </div>
        <div className="page-actions">
          <Link href="/stories/new" className="btn btn-ghost">
            <Icon name="sparkle" size={14} /> AI Studio
          </Link>
          <Link href="/stories/new" className="btn btn-primary">
            <Icon name="plus" size={14} /> New work
          </Link>
        </div>
      </div>

      <div className="home-grid">
        <div>
          <Composer initials={initials} />

          <div style={{ height: 22 }} />

          {feed.items.length === 0 ? (
            <article className="post">
              <div className="post-head">
                <div className="avatar avatar-c">··</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="row" style={{ gap: 8 }}>
                    <span className="post-name">Your feed is quiet</span>
                    <span className="post-meta">just now</span>
                  </div>
                </div>
              </div>
              <p className="post-body">
                Follow a few creators or publish your first post above to start filling this feed. Real
                comments and reactions are wired up — try posting a thought, then react and comment from a
                second browser/account.
              </p>
            </article>
          ) : (
            feed.items.map((p) => <PostCard key={p.id} post={p} />)
          )}
        </div>

        <aside className="rail">
          <div className="rail-card">
            <div className="rail-title">
              <h3>Filter</h3>
            </div>
            <FeedFilters />
          </div>

          {trending.length > 0 && (
            <div className="rail-card">
              <div className="rail-title">
                <h3>Trending tags</h3>
              </div>
              <div>
                {trending.map((t) => (
                  <a key={t.tag} className="tag" href={`/search?q=%23${encodeURIComponent(t.tag)}`}>
                    #{t.tag}
                    <span className="count">{t.count}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="rail-card">
            <div className="rail-title">
              <h3>You</h3>
              <Link href="/settings/profile">Edit →</Link>
            </div>
            <div className="minilist">
              <div className="row-item">
                <Icon name="lock" size={16} style={{ color: "var(--cool)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>Privacy</div>
                  <div className="meta">{profile?.privacyLevel ?? "PUBLIC"}</div>
                </div>
              </div>
              <div className="row-item">
                <Icon name="star" size={16} style={{ color: "var(--accent)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>Roles</div>
                  <div className="meta">{profile?.roles?.join(", ") || "USER"}</div>
                </div>
              </div>
              <div className="row-item">
                <Icon name="grid" size={16} style={{ color: "var(--plum)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>Connected apps</div>
                  <div className="meta">
                    <Link href="/settings/connected-apps">Manage →</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
