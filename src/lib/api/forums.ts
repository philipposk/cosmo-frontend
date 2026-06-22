import { apiFetch } from "./client";

export type Forum = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  _count?: { threads: number };
};

export type ForumThread = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  replyCount: number;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
  _count?: { replies: number };
};

export type ThreadDetail = ForumThread & {
  forum: Forum;
  replies: Array<{
    id: string;
    createdAt: string;
    content: string;
    author: ForumThread["author"];
  }>;
};

export function listForums() {
  return apiFetch<Forum[]>("/forums", {});
}

export function listThreads(slug: string) {
  return apiFetch<ForumThread[]>(`/forums/${slug}/threads`, {});
}

export function getThread(threadId: string) {
  return apiFetch<ThreadDetail>(`/forums/threads/${threadId}`, {});
}

export function createThread(
  token: string,
  slug: string,
  payload: { title: string; body: string },
) {
  return apiFetch<ForumThread>(`/forums/${slug}/threads`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function reply(token: string, threadId: string, content: string) {
  return apiFetch(`/forums/threads/${threadId}/replies`, {
    method: "POST",
    token,
    body: JSON.stringify({ content }),
  });
}

export function editThread(
  token: string,
  threadId: string,
  payload: { title: string; body: string },
) {
  return apiFetch<ForumThread>(`/forums/threads/${threadId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteThread(token: string, threadId: string) {
  return apiFetch(`/forums/threads/${threadId}`, { method: "DELETE", token });
}

export function editReply(token: string, replyId: string, content: string) {
  return apiFetch<{ id: string; content: string }>(`/forums/replies/${replyId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ content }),
  });
}

export function deleteReply(token: string, replyId: string) {
  return apiFetch(`/forums/replies/${replyId}`, { method: "DELETE", token });
}
