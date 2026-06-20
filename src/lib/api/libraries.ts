import { apiFetch } from "./client";

export type LibraryCategory =
  | "BOOKS"
  | "COMICS"
  | "ART"
  | "MUSIC"
  | "PODCASTS";

export type LibraryVisibility = "PUBLIC" | "FRIENDS" | "PRIVATE";

export type LibraryItem = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  visibility: LibraryVisibility;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type LibraryItemInput = {
  title?: string;
  description?: string;
  category?: LibraryCategory;
  visibility?: LibraryVisibility;
  tags?: string[];
};

export function listOwn(token: string, category?: LibraryCategory) {
  const qs = category ? `?category=${category}` : "";
  return apiFetch<LibraryItem[]>(`/libraries/me${qs}`, { token });
}

export function createItem(token: string, payload: LibraryItemInput) {
  return apiFetch<LibraryItem>("/libraries", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updateItem(
  token: string,
  id: string,
  payload: LibraryItemInput,
) {
  return apiFetch<LibraryItem>(`/libraries/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteItem(token: string, id: string) {
  return apiFetch(`/libraries/${id}`, { method: "DELETE", token });
}
