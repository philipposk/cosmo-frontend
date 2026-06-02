"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/session";
import { Icon } from "@/components/common/Icon";
import {
  addComment,
  listComments,
  reactToPost,
  type FeedComment,
  type FeedPost,
} from "@/lib/api/feed";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d`;
  return new Date(iso).toLocaleDateString();
}

function tone(seed: string): string {
  const letters = ["a", "b", "c", "d", "e", "f"] as const;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return `avatar-${letters[h % letters.length]}`;
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function PostCard({ post }: { post: FeedPost }) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.token ?? null;
  const [reacted, setReacted] = useState(post.reactedKinds.includes("LIKE"));
  const [likes, setLikes] = useState(post.likesCount);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [, startTransition] = useTransition();

  async function onLike() {
    if (!token) return;
    setReacted((p) => !p);
    setLikes((n) => (reacted ? n - 1 : n + 1));
    try {
      const result = await reactToPost(token, post.id, "LIKE");
      setReacted(result.reacted);
      startTransition(() => router.refresh());
    } catch {
      setReacted(reacted);
      setLikes(post.likesCount);
    }
  }

  async function toggleComments() {
    const next = !showComments;
    setShowComments(next);
    if (next && comments.length === 0 && token) {
      setLoadingComments(true);
      try {
        const list = await listComments(token, post.id);
        setComments(list);
      } finally {
        setLoadingComments(false);
      }
    }
  }

  async function onSubmitComment() {
    if (!token || !commentText.trim()) return;
    try {
      const comment = await addComment(token, post.id, commentText.trim());
      setComments((prev) => [...prev, comment]);
      setCommentText("");
      startTransition(() => router.refresh());
    } catch {
      // no-op for now
    }
  }

  return (
    <article className="post">
      <div className="post-head">
        <div className={"avatar " + tone(post.author.id)}>
          {initialsOf(post.author.displayName)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="row" style={{ gap: 8 }}>
            <Link href={`/profile/${post.author.username}`} className="post-name">
              {post.author.displayName}
            </Link>
            <span className="post-meta">@{post.author.username} · {timeAgo(post.createdAt)}</span>
          </div>
          <div className="row" style={{ gap: 6, marginTop: 3, flexWrap: "wrap" }}>
            <span className="eyebrow" style={{ textTransform: "none", fontSize: 11, letterSpacing: 0 }}>
              <Icon name={post.visibility === "PUBLIC" ? "eye" : "users"} size={11} /> {post.visibility}
            </span>
            {post.tags.map((t) => (
              <span key={t} className="pill">
                #{t}
              </span>
            ))}
          </div>
        </div>
      </div>
      {post.title && <h3 style={{ margin: "10px 0 0", fontWeight: 500 }}>{post.title}</h3>}
      <p className="post-body" style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>
      {post.media.length > 0 && (
        <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
          {post.media.map((m) => {
            const base =
              process.env.NEXT_PUBLIC_MINIO_PUBLIC_URL ?? "http://localhost:9100";
            const src = `${base}/${m.bucket}/${m.objectKey}`;
            if (m.kind === "IMAGE") {
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={m.id}
                  src={src}
                  alt=""
                  style={{
                    width: "100%",
                    borderRadius: "var(--r-md)",
                    border: "1px solid var(--line-soft)",
                    display: "block",
                  }}
                />
              );
            }
            if (m.kind === "AUDIO") {
              return <audio key={m.id} controls src={src} style={{ width: "100%" }} />;
            }
            if (m.kind === "VIDEO") {
              return (
                <video
                  key={m.id}
                  controls
                  src={src}
                  style={{ width: "100%", borderRadius: "var(--r-md)" }}
                />
              );
            }
            return (
              <a key={m.id} href={src} className="pill pill-plum" target="_blank" rel="noreferrer">
                Document
              </a>
            );
          })}
        </div>
      )}
      <div className="post-foot">
        <button type="button" className="act" onClick={onLike} disabled={!token}>
          <Icon name="heart" /> {likes}
        </button>
        <button type="button" className="act" onClick={toggleComments} disabled={!token}>
          <Icon name="msg" /> {post.commentsCount}
        </button>
        <div style={{ flex: 1 }} />
        <button type="button" className="act" disabled>
          <Icon name="bookmark" />
        </button>
      </div>
      {showComments && (
        <div style={{ marginTop: 12, borderTop: "1px solid var(--line-soft)", paddingTop: 12 }}>
          {loadingComments && <div className="meta">Loading comments…</div>}
          {!loadingComments && comments.length === 0 && (
            <div className="meta">No comments yet. Be the first.</div>
          )}
          {comments.map((c) => (
            <div key={c.id} className="row-item" style={{ borderTop: 0, padding: "6px 0" }}>
              <div className={"avatar sm " + tone(c.author.id)}>{initialsOf(c.author.displayName)}</div>
              <div style={{ flex: 1, fontSize: 13 }}>
                <b style={{ fontWeight: 500 }}>{c.author.displayName}</b>
                <span style={{ color: "var(--mute)", marginLeft: 6 }}>{timeAgo(c.createdAt)}</span>
                <div>{c.body}</div>
              </div>
            </div>
          ))}
          <div className="row" style={{ marginTop: 10, gap: 8 }}>
            <input
              placeholder="Write a comment…"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSubmitComment()}
              style={{
                flex: 1,
                padding: "8px 12px",
                border: "1px solid var(--line)",
                borderRadius: "var(--r-sm)",
                background: "var(--surface-2)",
              }}
            />
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onSubmitComment}
              disabled={!commentText.trim()}
            >
              Reply
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export default PostCard;
