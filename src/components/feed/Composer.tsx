"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/session";
import { Icon } from "@/components/common/Icon";
import { createPost } from "@/lib/api/feed";
import { uploadFile } from "@/lib/api/media";

type Props = {
  initials: string;
};

const AUDIENCES = ["Public", "Friends", "Private"] as const;
type Audience = (typeof AUDIENCES)[number];

const AUDIENCE_TO_VISIBILITY: Record<Audience, "PUBLIC" | "FRIENDS" | "PRIVATE"> = {
  Public: "PUBLIC",
  Friends: "FRIENDS",
  Private: "PRIVATE",
};

type Attachment = { mediaId: string; publicUrl: string; kind: string; name: string };

export function Composer({ initials }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [audience, setAudience] = useState<Audience>("Friends");
  const [error, setError] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [uploads, setUploads] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [, startTransition] = useTransition();
  const disabled = (text.trim().length === 0 && uploads.length === 0) || posting;

  async function onFiles(files: FileList | null, accept: "image" | "audio" | "video") {
    if (!files?.length || !session?.user?.token) return;
    setUploading(true);
    setError(null);
    try {
      const next: Attachment[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith(accept + "/")) {
          throw new Error(`${file.name} is not a ${accept} file.`);
        }
        const result = await uploadFile(session.user.token, file);
        next.push({ ...result, name: file.name });
      }
      setUploads((prev) => [...prev, ...next]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function onSubmit() {
    if (!session?.user?.token) {
      setError("Sign in to post.");
      return;
    }
    setPosting(true);
    setError(null);
    try {
      await createPost(session.user.token, {
        content: text.trim(),
        visibility: AUDIENCE_TO_VISIBILITY[audience],
        tags: tags
          .split(/[\s,]+/)
          .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
          .filter(Boolean),
        mediaIds: uploads.map((u) => u.mediaId),
      });
      setText("");
      setTags("");
      setUploads([]);
      startTransition(() => router.refresh());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPosting(false);
    }
  }

  function cycleAudience() {
    setAudience((prev) => {
      const idx = AUDIENCES.indexOf(prev);
      return AUDIENCES[(idx + 1) % AUDIENCES.length];
    });
  }

  return (
    <div className="composer">
      <div className="avatar avatar-a">{initials || "··"}</div>
      <div style={{ flex: 1 }}>
        <textarea
          placeholder="Share a draft, a sketch, or a thought…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !disabled) onSubmit();
          }}
        />
        <input
          placeholder="Tags (comma or space separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{
            marginTop: 8,
            width: "100%",
            border: 0,
            outline: 0,
            background: "transparent",
            fontSize: "var(--t-2)",
            color: "var(--mute)",
          }}
        />
        {uploads.length > 0 && (
          <div className="row" style={{ gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {uploads.map((u) => (
              <div
                key={u.mediaId}
                className="pill pill-cool"
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <Icon name={u.kind === "IMAGE" ? "photo" : u.kind === "AUDIO" ? "mic" : "film"} size={12} />
                {u.name.length > 28 ? u.name.slice(0, 25) + "…" : u.name}
                <button
                  type="button"
                  onClick={() => setUploads((prev) => prev.filter((p) => p.mediaId !== u.mediaId))}
                  style={{ marginLeft: 4, color: "inherit" }}
                  aria-label="Remove attachment"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {error && (
          <div style={{ color: "var(--accent-ink)", fontSize: "var(--t-1)", marginTop: 6 }}>{error}</div>
        )}
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => onFiles(e.target.files, "image")}
        />
        <div className="composer-tools">
          <button
            type="button"
            className="tool"
            disabled={uploading}
            onClick={() => fileInput.current?.click()}
          >
            <Icon name="photo" size={13} /> {uploading ? "Uploading…" : "Image"}
          </button>
          <button type="button" className="tool" disabled title="Audio uploads — next milestone">
            <Icon name="mic" size={13} /> Audio
          </button>
          <button type="button" className="tool" disabled title="Video uploads — next milestone">
            <Icon name="film" size={13} /> Video
          </button>
          <button type="button" className="tool" disabled>
            <Icon name="poll" size={13} /> Poll
          </button>
          <button
            type="button"
            className="tool"
            onClick={() => router.push("/stories/new")}
            title="Open AI Studio"
          >
            <Icon name="sparkle" size={13} /> AI draft
          </button>
          <div style={{ flex: 1 }} />
          <button type="button" className="chip-select" onClick={cycleAudience} title="Cycle audience">
            <span className="label">Audience</span> <b>{audience}</b>
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={disabled}
            onClick={onSubmit}
          >
            {posting ? "Posting…" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Composer;
