import { apiFetch } from "./client";

export type Notification = {
  id: string;
  createdAt: string;
  kind: string;
  message: string | null;
  targetType: string | null;
  targetId: string | null;
  readAt: string | null;
  actor: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  } | null;
};

export type NotificationPage = {
  items: Notification[];
  unreadCount: number;
};

export function listNotifications(token: string, unreadOnly = false) {
  const qs = unreadOnly ? "?unread=1" : "";
  return apiFetch<NotificationPage>(`/notifications${qs}`, { token });
}

export function markAllRead(token: string) {
  return apiFetch(`/notifications/read`, { method: "PATCH", token });
}
