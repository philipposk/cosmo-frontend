"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/session";
import { Icon } from "@/components/common/Icon";
import { searchAll, type SearchHit } from "@/lib/api/search";

export function CommandK() {
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  useEffect(() => {
    if (!session?.user?.token) return;
    const term = query.trim();
    if (term.length < 2) {
      setHits([]);
      return;
    }
    const token = session.user.token;
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const results = await searchAll(token, term);
        if (!cancelled) setHits(results);
      } catch {
        if (!cancelled) setHits([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query, session]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20,17,13,0.4)",
        zIndex: 100,
        display: "grid",
        placeItems: "start center",
        paddingTop: "10vh",
      }}
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(640px, 92vw)",
          background: "var(--surface)",
          borderRadius: "var(--r-lg)",
          border: "1px solid var(--line)",
          boxShadow: "var(--shadow-lg)",
          overflow: "hidden",
        }}
      >
        <div className="row" style={{ padding: "12px 14px", borderBottom: "1px solid var(--line-soft)", gap: 10 }}>
          <Icon name="search" size={16} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts, stories, people, threads…"
            style={{
              flex: 1,
              border: 0,
              outline: 0,
              background: "transparent",
              fontSize: "var(--t-3)",
            }}
          />
          <kbd
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--subtle)",
              border: "1px solid var(--line)",
              borderRadius: 4,
              padding: "1px 5px",
            }}
          >
            esc
          </kbd>
        </div>
        <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
          {loading && <div style={{ padding: 18, color: "var(--mute)" }}>Searching…</div>}
          {!loading && query.trim().length < 2 && (
            <div style={{ padding: 18, color: "var(--mute)" }}>
              Type at least 2 characters to search across the platform.
            </div>
          )}
          {!loading && query.trim().length >= 2 && hits.length === 0 && (
            <div style={{ padding: 18, color: "var(--mute)" }}>No results.</div>
          )}
          {hits.map((hit) => (
            <button
              key={`${hit.type}-${hit.id}`}
              type="button"
              onClick={() => {
                setOpen(false);
                router.push(hit.href);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "12px 16px",
                borderBottom: "1px solid var(--line-soft)",
                textAlign: "left",
                background: "transparent",
              }}
            >
              <div className="row" style={{ gap: 8 }}>
                <span className="pill">{hit.type}</span>
                <b style={{ fontWeight: 500 }}>{hit.title}</b>
              </div>
              {hit.snippet && (
                <div style={{ color: "var(--mute)", fontSize: "var(--t-1)", marginTop: 4 }}>
                  {hit.snippet}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CommandK;
