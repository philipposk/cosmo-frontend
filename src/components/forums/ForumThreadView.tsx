"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteReply,
  deleteThread,
  editReply,
  editThread,
  type ThreadDetail,
} from "@/lib/api/forums";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

type Props = {
  thread: ThreadDetail;
  slug: string;
  currentUserId: string | null;
  roles: string[];
  token: string | null;
};

export function ForumThreadView({ thread, slug, currentUserId, roles, token }: Props) {
  const router = useRouter();
  const isStaff = roles.includes("ADMIN") || roles.includes("MOD");
  const canManage = (authorId: string) =>
    !!token && (currentUserId === authorId || isStaff);

  // ── Thread body (with inline edit) ──
  const [body, setBody] = useState(thread.body);
  const [title, setTitle] = useState(thread.title);
  const [editingThread, setEditingThread] = useState(false);
  const [draftTitle, setDraftTitle] = useState(thread.title);
  const [draftBody, setDraftBody] = useState(thread.body);
  const [error, setError] = useState<string | null>(null);

  // ── Replies ──
  const [replies, setReplies] = useState(thread.replies);
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [draftReply, setDraftReply] = useState("");

  async function saveThread() {
    if (!token || !draftTitle.trim() || !draftBody.trim()) return;
    try {
      const updated = await editThread(token, thread.id, {
        title: draftTitle.trim(),
        body: draftBody.trim(),
      });
      setTitle(updated.title);
      setBody(updated.body);
      setEditingThread(false);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function removeThread() {
    if (!token || !window.confirm("Delete this thread? This cannot be undone.")) return;
    try {
      await deleteThread(token, thread.id);
      router.push(`/forums/${slug}`);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function saveReply(id: string) {
    if (!token || !draftReply.trim()) return;
    try {
      const updated = await editReply(token, id, draftReply.trim());
      setReplies((prev) =>
        prev.map((r) => (r.id === id ? { ...r, content: updated.content } : r)),
      );
      setEditingReply(null);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function removeReply(id: string) {
    if (!token || !window.confirm("Delete this reply?")) return;
    try {
      await deleteReply(token, id);
      setReplies((prev) => prev.filter((r) => r.id !== id));
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">
            <a href="/forums">Forums</a> · <a href={`/forums/${slug}`}>{thread.forum.name}</a>
          </div>
          {editingThread ? (
            <input
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              style={{ fontSize: 28, fontWeight: 700, width: "100%" }}
            />
          ) : (
            <h1 className="display">{title}</h1>
          )}
          <p className="sub">by @{thread.author.username} · {timeAgo(thread.createdAt)}</p>
        </div>
      </div>

      <article className="post">
        {editingThread ? (
          <>
            <textarea
              rows={6}
              value={draftBody}
              onChange={(e) => setDraftBody(e.target.value)}
              style={{ width: "100%" }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button type="button" className="btn btn-primary btn-sm" onClick={saveThread}>Save</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditingThread(false)}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <p className="post-body" style={{ whiteSpace: "pre-wrap" }}>{body}</p>
            {canManage(thread.author.id) && (
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setDraftTitle(title);
                    setDraftBody(body);
                    setEditingThread(true);
                  }}
                >
                  Edit
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={removeThread}>Delete</button>
              </div>
            )}
          </>
        )}
      </article>

      {error && <div style={{ color: "var(--accent-ink)", fontSize: "var(--t-1)", marginTop: 8 }}>{error}</div>}

      <div style={{ marginTop: 18 }}>
        {replies.map((r) => (
          <article key={r.id} className="post">
            <div className="row" style={{ gap: 10, marginBottom: 6 }}>
              <b style={{ fontWeight: 500 }}>{r.author.displayName}</b>
              <span className="meta">@{r.author.username} · {timeAgo(r.createdAt)}</span>
            </div>
            {editingReply === r.id ? (
              <>
                <textarea
                  rows={3}
                  value={draftReply}
                  onChange={(e) => setDraftReply(e.target.value)}
                  style={{ width: "100%" }}
                />
                <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => saveReply(r.id)}>Save</button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditingReply(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p className="post-body" style={{ whiteSpace: "pre-wrap" }}>{r.content}</p>
                {canManage(r.author.id) && (
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setEditingReply(r.id);
                        setDraftReply(r.content);
                      }}
                    >
                      Edit
                    </button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeReply(r.id)}>Delete</button>
                  </div>
                )}
              </>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
