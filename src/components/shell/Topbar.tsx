"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth/session";
import { Icon } from "@/components/common/Icon";
import { listNotifications } from "@/lib/api/notifications";
import { useSocketEvent } from "@/lib/socket";

const CRUMB_LABEL: Record<string, string> = {
  dashboard: "Home",
  stories: "Stories",
  libraries: "Libraries",
  forums: "Forums",
  goals: "Goals",
  membership: "Membership",
  settings: "Settings",
  profile: "Profile",
  notifications: "Notifications",
};

function crumbFor(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean)[0] ?? "dashboard";
  return CRUMB_LABEL[segment] ?? "Home";
}

export function Topbar() {
  const pathname = usePathname() ?? "/dashboard";
  const { data: session } = useSession();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!session?.user?.token) return;
    let cancelled = false;
    listNotifications(session.user.token, true)
      .then((data) => {
        if (!cancelled) setUnread(data.unreadCount);
      })
      .catch(() => {
        /* ignore */
      });
    return () => {
      cancelled = true;
    };
  }, [session]);

  useSocketEvent("notification", () => {
    setUnread((n) => n + 1);
  });

  useSocketEvent("notifications:read-all", () => {
    setUnread(0);
  });

  return (
    <div className="topbar">
      <div className="crumbs">
        <span>Cosmo</span>
        <span>·</span>
        <span className="now">{crumbFor(pathname)}</span>
      </div>
      <button
        type="button"
        className="search"
        onClick={() => {
          const event = new KeyboardEvent("keydown", {
            key: "k",
            metaKey: true,
            bubbles: true,
          });
          window.dispatchEvent(event);
        }}
        title="Open search (⌘K)"
      >
        <Icon name="search" size={15} />
        <span style={{ flex: 1, textAlign: "left", color: "var(--mute)" }}>
          Search libraries, forums, people…
        </span>
        <kbd>⌘K</kbd>
      </button>
      <div className="topbar-right">
        <Link href="/notifications" className="icon-btn" aria-label="Notifications">
          <Icon name="bell" size={16} />
          {unread > 0 && <span className="dot" />}
        </Link>
        <Link href="/stories/new" className="btn btn-accent btn-sm">
          <Icon name="plus" size={14} />
          Create
        </Link>
      </div>
    </div>
  );
}

export default Topbar;
