import { apiFetch } from "./client";

export type FeedAuthor = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
};

export type FeedMedia = {
  id: string;
  kind: "IMAGE" | "AUDIO" | "VIDEO" | "DOCUMENT";
  bucket: string;
  objectKey: string;
  contentType: string;
  status: "PENDING" | "READY" | "FAILED";
  width: number | null;
  height: number | null;
};

export type FeedPost = {
  id: string;
  createdAt: string;
  author: FeedAuthor;
  title: string | null;
  content: string;
  category: string;
  visibility: "PUBLIC" | "FRIENDS" | "PRIVATE";
  tags: string[];
  likesCount: number;
  commentsCount: number;
  reactedKinds: string[];
  media: FeedMedia[];
};

export type FeedPage = {
  items: FeedPost[];
  nextCursor: string | null;
};

export type FeedComment = {
  id: string;
  createdAt: string;
  body: string;
  parentId: string | null;
  author: FeedAuthor;
};

export type CreatePostPayload = {
  title?: string;
  content: string;
  visibility?: "PUBLIC" | "FRIENDS" | "PRIVATE";
  tags?: string[];
  mediaIds?: string[];
};

export function fetchFeed(
  token: string,
  cursor?: string,
  sort: "new" | "hot" = "new",
) {
  const params = new URLSearchParams();
  if (cursor) params.set("cursor", cursor);
  if (sort === "hot") params.set("sort", "hot");
  const qs = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<FeedPage>(`/feed${qs}`, { token });
}

export function fetchTrendingTags() {
  return apiFetch<Array<{ tag: string; count: number }>>("/feed/trending-tags", {});
}

export function createPost(token: string, payload: CreatePostPayload) {
  return apiFetch<FeedPost>(`/posts`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function reactToPost(
  token: string,
  postId: string,
  kind: "LIKE" | "LOVE" | "INSPIRE" | "TIP" | "BOOKMARK",
) {
  return apiFetch<{ reacted: boolean }>(`/posts/${postId}/reactions`, {
    method: "POST",
    token,
    body: JSON.stringify({ kind }),
  });
}

export function listComments(token: string, postId: string) {
  return apiFetch<FeedComment[]>(`/posts/${postId}/comments`, { token });
}

export function addComment(
  token: string,
  postId: string,
  body: string,
  parentId?: string,
) {
  return apiFetch<FeedComment>(`/posts/${postId}/comments`, {
    method: "POST",
    token,
    body: JSON.stringify({ body, parentId }),
  });
}
