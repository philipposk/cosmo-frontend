import { env } from "@/lib/env";

export type ConnectedAppKey = "AI_OS" | "LIFEHUB" | "APPMAKER" | "APPBLUEPRINTS";

export type ConnectedAppStatus =
  | "CONNECTED"
  | "PENDING"
  | "DISCONNECTED"
  | "COMING_SOON";

export type ConnectedAppEntry = {
  key: ConnectedAppKey;
  name: string;
  tagline: string;
  description: string;
  available: boolean;
  status: ConnectedAppStatus;
  lastSyncAt: string | null;
  scopes: string[];
  detailsUrl: string | null;
};

export async function listConnectedApps(token: string): Promise<ConnectedAppEntry[]> {
  const res = await fetch(`${env.backendApiUrl}/connected-apps`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Failed to load connected apps (${res.status})`);
  }
  return (await res.json()) as ConnectedAppEntry[];
}

export async function connectApp(
  token: string,
  appKey: ConnectedAppKey,
): Promise<{ ok: boolean; message?: string }> {
  const res = await fetch(
    `${env.backendApiUrl}/connected-apps/${appKey}/connect`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  if (res.ok) return { ok: true };
  let message: string | undefined;
  try {
    const body = (await res.json()) as { message?: string };
    message = body.message;
  } catch {
    message = await res.text().catch(() => undefined);
  }
  return { ok: false, message };
}

export async function disconnectApp(token: string, appKey: ConnectedAppKey) {
  const res = await fetch(`${env.backendApiUrl}/connected-apps/${appKey}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Disconnect failed (${res.status})`);
}
