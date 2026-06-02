import { apiFetch } from "./client";

export type SearchHit = {
  type: "POST" | "USER" | "STORY" | "LIBRARY" | "FORUM_THREAD";
  id: string;
  title: string;
  snippet: string | null;
  href: string;
};

export function searchAll(token: string, q: string) {
  return apiFetch<SearchHit[]>(`/search?q=${encodeURIComponent(q)}`, { token });
}
