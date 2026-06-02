import { apiFetch } from "./client";

export type LibraryItem = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  visibility: "PUBLIC" | "FRIENDS" | "PRIVATE";
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export function listOwn(token: string) {
  return apiFetch<LibraryItem[]>("/libraries/me", { token });
}

export function createItem(
  token: string,
  payload: { title: string; description?: string; tags?: string[] },
) {
  return apiFetch<LibraryItem>("/libraries", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteItem(token: string, id: string) {
  return apiFetch(`/libraries/${id}`, { method: "DELETE", token });
}
