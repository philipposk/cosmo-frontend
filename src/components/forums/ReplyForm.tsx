"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/session";
import { reply } from "@/lib/api/forums";

export function ReplyForm({ threadId }: { threadId: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function onSubmit() {
    if (!session?.user?.token) {
      setError("Sign in to reply.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await reply(session.user.token, threadId, content);
      setContent("");
      startTransition(() => router.refresh());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h3 style={{ fontFamily: "var(--display)", fontWeight: 400, fontSize: 18, margin: 0 }}>Reply</h3>
      <div className="field" style={{ marginTop: 10 }}>
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add to the conversation…"
        />
      </div>
      {error && <div style={{ color: "var(--accent-ink)", fontSize: "var(--t-1)" }}>{error}</div>}
      <button
        type="button"
        className="btn btn-primary"
        onClick={onSubmit}
        disabled={busy || !content.trim()}
      >
        {busy ? "Posting…" : "Post reply"}
      </button>
    </div>
  );
}

export default ReplyForm;
