"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/common/Icon";
import {
  createItem,
  deleteItem,
  updateItem,
  type LibraryCategory,
  type LibraryItem,
  type LibraryVisibility,
} from "@/lib/api/libraries";

const CATEGORIES: { value: LibraryCategory; label: string }[] = [
  { value: "BOOKS", label: "Books" },
  { value: "COMICS", label: "Comics" },
  { value: "ART", label: "Art" },
  { value: "MUSIC", label: "Music" },
  { value: "PODCASTS", label: "Podcasts" },
];

const VISIBILITIES: { value: LibraryVisibility; label: string }[] = [
  { value: "PUBLIC", label: "Public" },
  { value: "FRIENDS", label: "Friends only" },
  { value: "PRIVATE", label: "Private" },
];

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "BOOKS" as LibraryCategory,
  visibility: "PUBLIC" as LibraryVisibility,
  tagsRaw: "",
};

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filter, setFilter] = useState<LibraryCategory | "ALL">("ALL");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const visible = useMemo(
    () => (filter === "ALL" ? items : items.filter((i) => i.category === filter)),
    [items, filter],
  );

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
    setError(null);
  }

  function parseTags(raw: string): string[] {
    return raw
      .split(/[\s,]+/)
      .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
      .filter(Boolean);
  }

  function startEdit(it: LibraryItem) {
    setEditingId(it.id);
    setShowForm(true);
    setError(null);
    setForm({
      title: it.title,
      description: it.description ?? "",
      category: (CATEGORIES.find((c) => c.value === it.category)?.value ??
        "BOOKS") as LibraryCategory,
      visibility: it.visibility,
      tagsRaw: it.tags.join(", "),
    });
  }

  async function onSubmit() {
    if (!form.title.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        category: form.category,
        visibility: form.visibility,
        tags: parseTags(form.tagsRaw),
      };
      if (editingId) {
        const updated = await updateItem(token, editingId, payload);
        setItems((prev) => prev.map((i) => (i.id === editingId ? updated : i)));
      } else {
        const item = await createItem(token, payload);
        setItems((prev) => [item, ...prev]);
      }
      resetForm();
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
      <div className="row between" style={{ marginBottom: 14, alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button
            type="button"
            className={"btn btn-sm " + (filter === "ALL" ? "btn-primary" : "btn-ghost")}
            onClick={() => setFilter("ALL")}
          >
            All ({items.length})
          </button>
          {CATEGORIES.map((c) => {
            const n = items.filter((i) => i.category === c.value).length;
            if (n === 0) return null;
            return (
              <button
                key={c.value}
                type="button"
                className={"btn btn-sm " + (filter === c.value ? "btn-primary" : "btn-ghost")}
                onClick={() => setFilter(c.value)}
              >
                {c.label} ({n})
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
        >
          <Icon name="plus" size={14} /> {showForm ? "Cancel" : "Add item"}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="field">
            <label>Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div className="field" style={{ flex: 1, minWidth: 160 }}>
              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value as LibraryCategory }))
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="field" style={{ flex: 1, minWidth: 160 }}>
              <label>Visibility</label>
              <select
                value={form.visibility}
                onChange={(e) =>
                  setForm((f) => ({ ...f, visibility: e.target.value as LibraryVisibility }))
                }
              >
                {VISIBILITIES.map((v) => (
                  <option key={v.value} value={v.value}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label>Tags</label>
            <input
              value={form.tagsRaw}
              onChange={(e) => setForm((f) => ({ ...f, tagsRaw: e.target.value }))}
              placeholder="slow-living, watercolor"
            />
          </div>
          {error && <div style={{ color: "var(--accent-ink)", fontSize: "var(--t-1)" }}>{error}</div>}
          <button
            type="button"
            className="btn btn-primary"
            onClick={onSubmit}
            disabled={busy || !form.title.trim()}
          >
            {busy ? "Saving…" : editingId ? "Save changes" : "Add"}
          </button>
        </div>
      )}

      <div className="lib-grid">
        {visible.length === 0 && (
          <div className="card" style={{ color: "var(--mute)", gridColumn: "1 / -1" }}>
            {items.length === 0
              ? "Empty library — add your first item above."
              : "Nothing in this category yet."}
          </div>
        )}
        {visible.map((it) => (
          <div key={it.id} className="lib-card">
            <div className="lib-cover">
              <span className="badge">{it.category}</span>
              {it.visibility !== "PUBLIC" && (
                <span className="badge" style={{ marginLeft: 6, opacity: 0.7 }}>
                  {it.visibility === "PRIVATE" ? "Private" : "Friends"}
                </span>
              )}
            </div>
            <div className="lib-title">{it.title}</div>
            <div className="lib-meta">{it.tags.map((t) => `#${t}`).join(" · ") || "—"}</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => startEdit(it)}>
                Edit
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => onDelete(it.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LibraryBoard;
