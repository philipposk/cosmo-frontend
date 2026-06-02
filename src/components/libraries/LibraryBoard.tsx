"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/common/Icon";
import { createItem, deleteItem, type LibraryItem } from "@/lib/api/libraries";

export function LibraryBoard({
  token,
  initial,
}: {
  token: string;
  initial: LibraryItem[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<LibraryItem[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsRaw, setTagsRaw] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function onCreate() {
    if (!title.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const tags = tagsRaw
        .split(/[\s,]+/)
        .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
        .filter(Boolean);
      const item = await createItem(token, { title, description, tags });
      setItems((prev) => [item, ...prev]);
      setTitle("");
      setDescription("");
      setTagsRaw("");
      setShowForm(false);
      startTransition(() => router.refresh());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm("Remove from library?")) return;
    try {
      await deleteItem(token, id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      startTransition(() => router.refresh());
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div>
      <div className="row between" style={{ marginBottom: 14 }}>
        <span className="eyebrow">{items.length} saved</span>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => setShowForm((v) => !v)}
        >
          <Icon name="plus" size={14} /> {showForm ? "Cancel" : "Add item"}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="field">
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Tags</label>
            <input
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
              placeholder="slow-living, watercolor"
            />
          </div>
          {error && <div style={{ color: "var(--accent-ink)", fontSize: "var(--t-1)" }}>{error}</div>}
          <button type="button" className="btn btn-primary" onClick={onCreate} disabled={busy || !title.trim()}>
            {busy ? "Saving…" : "Add"}
          </button>
        </div>
      )}

      <div className="lib-grid">
        {items.length === 0 && (
          <div className="card" style={{ color: "var(--mute)", gridColumn: "1 / -1" }}>
            Empty library — add your first item above.
          </div>
        )}
        {items.map((it) => (
          <div key={it.id} className="lib-card">
            <div className="lib-cover">
              <span className="badge">{it.category}</span>
            </div>
            <div className="lib-title">{it.title}</div>
            <div className="lib-meta">{it.tags.map((t) => `#${t}`).join(" · ") || it.visibility}</div>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => onDelete(it.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LibraryBoard;
