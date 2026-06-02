"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/common/Icon";
import {
  type ConnectedAppEntry,
  type ConnectedAppKey,
  connectApp,
  disconnectApp,
} from "@/lib/api/connected-apps";

const STATUS_LABEL: Record<ConnectedAppEntry["status"], string> = {
  CONNECTED: "Connected",
  PENDING: "Interest recorded",
  DISCONNECTED: "Not connected",
  COMING_SOON: "Coming soon",
};

const STATUS_PILL: Record<ConnectedAppEntry["status"], string> = {
  CONNECTED: "pill pill-cool",
  PENDING: "pill pill-warm",
  DISCONNECTED: "pill",
  COMING_SOON: "pill pill-plum",
};

type Props = {
  token: string;
  initial: ConnectedAppEntry[];
};

export function ConnectedAppsList({ token, initial }: Props) {
  const router = useRouter();
  const [apps, setApps] = useState(initial);
  const [busy, setBusy] = useState<ConnectedAppKey | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function onConnect(appKey: ConnectedAppKey) {
    setBusy(appKey);
    setMessage(null);
    const result = await connectApp(token, appKey);
    setBusy(null);
    if (result.ok) {
      setApps((prev) =>
        prev.map((a) => (a.key === appKey ? { ...a, status: "CONNECTED" } : a)),
      );
      startTransition(() => router.refresh());
    } else {
      setMessage(result.message ?? "Could not connect — please try again later.");
      setApps((prev) =>
        prev.map((a) => (a.key === appKey ? { ...a, status: "PENDING" } : a)),
      );
    }
  }

  async function onDisconnect(appKey: ConnectedAppKey) {
    setBusy(appKey);
    setMessage(null);
    try {
      await disconnectApp(token, appKey);
      setApps((prev) =>
        prev.map((a) =>
          a.key === appKey
            ? { ...a, status: a.available ? "DISCONNECTED" : "COMING_SOON" }
            : a,
        ),
      );
      startTransition(() => router.refresh());
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      {message && (
        <div className="card-flat" style={{ marginBottom: 16, color: "var(--mute)" }}>
          {message}
        </div>
      )}
      <div style={{ display: "grid", gap: 16 }}>
        {apps.map((app) => {
          const isBusy = busy === app.key;
          const canConnect = app.available && app.status !== "CONNECTED";
          const canDisconnect = app.status === "CONNECTED";
          return (
            <div key={app.key} className="card">
              <div className="row between" style={{ alignItems: "flex-start", gap: 16 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="row" style={{ gap: 8, marginBottom: 6 }}>
                    <span className={STATUS_PILL[app.status]}>{STATUS_LABEL[app.status]}</span>
                    {app.lastSyncAt && (
                      <span className="eyebrow" style={{ textTransform: "none", letterSpacing: 0 }}>
                        last sync · {new Date(app.lastSyncAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontFamily: "var(--display)", fontWeight: 400, fontSize: 22, margin: 0 }}>
                    {app.name}
                  </h3>
                  <p style={{ color: "var(--mute)", margin: "4px 0 10px", fontSize: "var(--t-2)" }}>
                    {app.tagline}
                  </p>
                  <p style={{ margin: 0, fontSize: "var(--t-2)", color: "var(--ink-2)" }}>
                    {app.description}
                  </p>
                </div>
                <div className="col" style={{ gap: 8, alignItems: "flex-end", flexShrink: 0 }}>
                  {canDisconnect && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => onDisconnect(app.key)}
                      disabled={isBusy}
                    >
                      <Icon name="lock" size={13} />
                      Disconnect
                    </button>
                  )}
                  {canConnect && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => onConnect(app.key)}
                      disabled={isBusy}
                    >
                      <Icon name="check" size={13} />
                      {isBusy ? "Connecting…" : "Connect"}
                    </button>
                  )}
                  {!app.available && app.status !== "CONNECTED" && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => onConnect(app.key)}
                      disabled={isBusy}
                      title="Register interest — we'll wire it up next"
                    >
                      <Icon name="star" size={13} />
                      {isBusy ? "Recording…" : "Notify me"}
                    </button>
                  )}
                  {app.detailsUrl && (
                    <a
                      href={app.detailsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost btn-sm"
                    >
                      <Icon name="arrow" size={13} />
                      Dashboard
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ConnectedAppsList;
