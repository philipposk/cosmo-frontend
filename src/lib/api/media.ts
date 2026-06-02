import { apiFetch } from "./client";

export type PresignResult = {
  mediaId: string;
  uploadUrl: string;
  publicUrl: string;
  kind: "IMAGE" | "AUDIO" | "VIDEO" | "DOCUMENT";
};

export function presignMedia(
  token: string,
  payload: { contentType: string; sizeBytes?: number; filename?: string },
) {
  return apiFetch<PresignResult>("/media/presign", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function markMediaReady(token: string, mediaId: string) {
  return apiFetch(`/media/${mediaId}/ready`, { method: "PATCH", token });
}

export async function uploadFile(
  token: string,
  file: File,
): Promise<{ mediaId: string; publicUrl: string; kind: PresignResult["kind"] }> {
  const presign = await presignMedia(token, {
    contentType: file.type || "application/octet-stream",
    sizeBytes: file.size,
    filename: file.name,
  });

  const putRes = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!putRes.ok) {
    throw new Error(`Upload failed: ${putRes.status} ${putRes.statusText}`);
  }

  await markMediaReady(token, presign.mediaId);

  return {
    mediaId: presign.mediaId,
    publicUrl: presign.publicUrl,
    kind: presign.kind,
  };
}
