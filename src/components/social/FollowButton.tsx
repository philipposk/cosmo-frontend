"use client";

import { useState } from "react";
import { env } from "@/lib/env";

type FollowStatus = "PENDING" | "ACCEPTED" | "BLOCKED" | null;
type FriendshipStatus = "PENDING" | "ACTIVE" | "BLOCKED" | "ENDED" | null;

type FollowButtonProps = {
  /** The viewer's Cosmo JWT — required; the API derives the actor from it. */
  token: string;
  targetUserId: string;
  initialFollowStatus: FollowStatus;
  initialFriendshipStatus: FriendshipStatus;
  initialFriendshipId: string | null;
};

export const FollowButton = ({
  token,
  targetUserId,
  initialFollowStatus,
  initialFriendshipStatus,
  initialFriendshipId,
}: FollowButtonProps) => {
  const [followStatus, setFollowStatus] = useState<FollowStatus>(initialFollowStatus);
  const [friendshipStatus, setFriendshipStatus] = useState<FriendshipStatus>(initialFriendshipStatus);
  const [friendshipId, setFriendshipId] = useState<string | null>(initialFriendshipId);
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = (path: string, init: RequestInit = {}) =>
    fetch(`${env.publicBackendApiUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(init.headers ?? {}),
      },
    });

  const handleFollow = async () => {
    setLoading(true);
    setError(null);
    try {
      if (followStatus === "ACCEPTED" || followStatus === "PENDING") {
        await api("/social/follow", {
          method: "DELETE",
          body: JSON.stringify({ followingId: targetUserId }),
        });
        setFollowStatus(null);
        return;
      }
      const res = await api("/social/follow", {
        method: "POST",
        body: JSON.stringify({ followingId: targetUserId }),
      });
      if (!res.ok) throw new Error("Unable to follow user");
      const data = await res.json();
      setFollowStatus(data.status as FollowStatus);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleFriend = async () => {
    setLoading(true);
    setError(null);
    try {
      if (friendshipStatus === "ACTIVE" && friendshipId) {
        await api(`/social/friend/${friendshipId}`, { method: "DELETE" });
        setFriendshipStatus("ENDED");
        setFriendshipId(null);
        return;
      }
      const res = await api("/social/friend", {
        method: "POST",
        body: JSON.stringify({ recipientId: targetUserId }),
      });
      if (!res.ok) throw new Error("Unable to request friendship");
      const data = await res.json();
      setFriendshipStatus(data.status as FriendshipStatus);
      setFriendshipId(data.id as string);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async () => {
    setLoading(true);
    setError(null);
    try {
      if (blocked) {
        await api(`/social/block/${targetUserId}`, { method: "DELETE" });
        setBlocked(false);
        return;
      }
      if (!window.confirm("Block this user? They won't be able to follow you.")) {
        setLoading(false);
        return;
      }
      const res = await api("/social/block", {
        method: "POST",
        body: JSON.stringify({ followingId: targetUserId }),
      });
      if (!res.ok) throw new Error("Unable to block user");
      setBlocked(true);
      setFollowStatus(null);
      setFriendshipStatus("ENDED");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const followLabel = loading
    ? "Saving…"
    : followStatus === "ACCEPTED"
      ? "Following"
      : followStatus === "PENDING"
        ? "Requested"
        : "Follow";

  const friendLabel = loading
    ? "Saving…"
    : friendshipStatus === "ACTIVE"
      ? "Friends"
      : friendshipStatus === "PENDING"
        ? "Request sent"
        : "Add friend";

  if (blocked) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ color: "var(--mute)", fontSize: "var(--t-2)" }}>You blocked this user.</span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={handleBlock} disabled={loading}>
          Unblock
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
      <button
        type="button"
        onClick={handleFollow}
        className={"btn btn-sm " + (followStatus ? "btn-ghost" : "btn-primary")}
        disabled={loading}
      >
        {followLabel}
      </button>
      <button
        type="button"
        onClick={handleFriend}
        className={"btn btn-sm " + (friendshipStatus === "ACTIVE" ? "btn-ghost" : "btn-ghost")}
        disabled={loading}
      >
        {friendLabel}
      </button>
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        style={{ color: "var(--mute)" }}
        onClick={handleBlock}
        disabled={loading}
      >
        Block
      </button>
      {error && <span style={{ color: "var(--accent-ink)", fontSize: "var(--t-1)" }}>{error}</span>}
    </div>
  );
};
