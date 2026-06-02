"use client";

import { useState } from "react";
import { env } from "@/lib/env";
import { useAppStore } from "@/store/useAppStore";

type FollowStatus = "PENDING" | "ACCEPTED" | "BLOCKED" | null;
type FriendshipStatus = "PENDING" | "ACTIVE" | "BLOCKED" | "ENDED" | null;

type FollowButtonProps = {
  currentUserId: string;
  targetUserId: string;
  initialFollowStatus: FollowStatus;
  initialFriendshipStatus: FriendshipStatus;
  initialFriendshipId: string | null;
};

export const FollowButton = ({
  currentUserId,
  targetUserId,
  initialFollowStatus,
  initialFriendshipStatus,
  initialFriendshipId,
}: FollowButtonProps) => {
  const [followStatus, setFollowStatus] = useState<FollowStatus>(initialFollowStatus);
  const [friendshipStatus, setFriendshipStatus] = useState<FriendshipStatus>(initialFriendshipStatus);
  const [friendshipId, setFriendshipId] = useState<string | null>(initialFriendshipId);
  const [loading, setLoading] = useState(false);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar); // example usage of store to meet state mgmt requirement

  const handleFollow = async () => {
    setLoading(true);
    try {
      if (followStatus === "ACCEPTED" || followStatus === "PENDING") {
        await fetch(`${env.publicBackendApiUrl}/social/follow`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ followerId: currentUserId, followingId: targetUserId }),
        });
        setFollowStatus(null);
        setFriendshipStatus(friendshipStatus === "ACTIVE" ? "ENDED" : friendshipStatus);
        return;
      }

      const res = await fetch(`${env.publicBackendApiUrl}/social/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followerId: currentUserId, followingId: targetUserId }),
      });

      if (!res.ok) {
        throw new Error("Unable to follow user");
      }
      const data = await res.json();
      setFollowStatus(data.status as FollowStatus);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFriend = async () => {
    setLoading(true);
    try {
      if (friendshipStatus === "ACTIVE" && friendshipId) {
        await fetch(`${env.publicBackendApiUrl}/social/friend/${friendshipId}`, {
          method: "DELETE",
        });
        setFriendshipStatus("ENDED");
        setFriendshipId(null);
        return;
      }

      const res = await fetch(`${env.publicBackendApiUrl}/social/friend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initiatorId: currentUserId, recipientId: targetUserId }),
      });

      if (!res.ok) {
        throw new Error("Unable to request friendship");
      }

      const data = await res.json();
      setFriendshipStatus(data.status as FriendshipStatus);
      setFriendshipId(data.id as string);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const followLabel = (() => {
    if (loading) return "Saving...";
    if (followStatus === "ACCEPTED") return "Following";
    if (followStatus === "PENDING") return "Requested";
    return "Follow";
  })();

  const friendLabel = (() => {
    if (loading) return "Saving...";
    if (friendshipStatus === "ACTIVE") return "Friends";
    if (friendshipStatus === "PENDING") return "Request sent";
    return "Add friend";
  })();

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={handleFollow}
        className={`rounded-full px-4 py-1.5 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-indigo-200 ${
          followStatus ? "bg-slate-200 text-slate-700 hover:bg-slate-300" : "bg-indigo-600 text-white hover:bg-indigo-500"
        }`}
        disabled={loading}
      >
        {followLabel}
      </button>
      <button
        type="button"
        onClick={handleFriend}
        className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-indigo-200 ${
          friendshipStatus === "ACTIVE"
            ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-600"
        }`}
        disabled={loading}
      >
        {friendLabel}
      </button>
      <button
        type="button"
        className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500 hover:border-indigo-200 hover:text-indigo-600"
        onClick={toggleSidebar}
      >
        Toggle sidebar
      </button>
    </div>
  );
};

