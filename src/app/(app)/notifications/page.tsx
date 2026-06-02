import { getServerSession } from "@/lib/auth/server";
import { env } from "@/lib/env";
import type { Notification, NotificationPage } from "@/lib/api/notifications";
import { MarkAllReadButton } from "@/components/notifications/MarkAllReadButton";
import { GuestPrompt } from "@/components/common/GuestPrompt";

async function load(token: string): Promise<NotificationPage> {
  try {
    const res = await fetch(`${env.backendApiUrl}/notifications`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { items: [], unreadCount: 0 };
    return (await res.json()) as NotificationPage;
  } catch {
    return { items: [], unreadCount: 0 };
  }
}

function describe(n: Notification): string {
  const actor = n.actor?.displayName ?? "Someone";
  switch (n.kind) {
    case "POST_REACTION":
      return `${actor} reacted to your post.`;
    case "POST_COMMENT":
      return `${actor} commented on your post.`;
    case "COMMENT_REPLY":
      return `${actor} replied to your comment.`;
    case "FOLLOW_REQUEST":
      return `${actor} wants to follow you.`;
    case "FOLLOW_ACCEPTED":
      return `${actor} accepted your follow.`;
    case "AI_JOB_COMPLETE":
      return n.message ?? "Your AI draft is ready.";
    case "MENTION":
      return `${actor} mentioned you.`;
    default:
      return n.message ?? n.kind;
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

export default async function NotificationsPage() {
  const session = await getServerSession();
  const token = session?.user?.token ?? null;

  if (!token) {
    return (
      <div>
        <div className="page-head">
          <div>
            <div className="eyebrow">Updates</div>
            <h1 className="display">Notifications</h1>
          </div>
        </div>
        <GuestPrompt action="receive notifications" callbackUrl="/notifications" />
      </div>
    );
  }

  const data = await load(token);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Updates</div>
          <h1 className="display">Notifications</h1>
          <p className="sub">{data.unreadCount} unread.</p>
        </div>
        <div className="page-actions">
          {data.unreadCount > 0 && <MarkAllReadButton token={token} />}
        </div>
      </div>

      <div className="card">
        {data.items.length === 0 ? (
          <div style={{ color: "var(--mute)" }}>No notifications yet.</div>
        ) : (
          <div className="minilist">
            {data.items.map((n) => (
              <div key={n.id} className="row-item">
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{describe(n)}</div>
                  <div className="meta">{timeAgo(n.createdAt)}</div>
                </div>
                {!n.readAt && <span className="pill pill-accent pill-dot">new</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
