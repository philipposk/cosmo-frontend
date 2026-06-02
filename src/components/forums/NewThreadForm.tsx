"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/session";
import { createThread } from "@/lib/api/forums";

export function NewThreadForm({ slug }: { slug: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function onSubmit() {
    if (!session?.user?.token) {
      setError("Sign in to start a thread.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await createThread(session.user.token, slug, { title, body });
      setTitle("");
      setBody("");
      startTransition(() => router.refresh());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h3 style={{ fontFamily: "var(--display)", fontWeight: 400, fontSize: 22, margin: 0 }}>
        Start a thread
      </h3>
      <div className="field" style={{ marginTop: 14 }}>
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="A clear, descriptive line…" />
      </div>
      <div className="field">
        <label>Body</label>
        <textarea
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add context, links, or a question."
        />
      </div>
      {error && <div style={{ color: "var(--accent-ink)", fontSize: "var(--t-1)" }}>{error}</div>}
      <button
        type="button"
        className="btn btn-primary"
        onClick={onSubmit}
        disabled={busy || !title.trim() || !body.trim()}
      >
        {busy ? "Posting…" : "Post thread"}
      </button>
    </div>
  );
}

export default NewThreadForm;
