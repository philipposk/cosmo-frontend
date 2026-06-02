"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth/session";
import { Icon, type IconName } from "@/components/common/Icon";
import { Brand } from "./Brand";

type NavEntry = { href: string; label: string; icon: IconName; count?: number };

const PRIMARY: NavEntry[] = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/stories", label: "Stories", icon: "pen" },
  { href: "/libraries", label: "Libraries", icon: "book" },
  { href: "/forums", label: "Forums", icon: "chat" },
  { href: "/goals", label: "Goals", icon: "target" },
];

const SECONDARY: NavEntry[] = [
  { href: "/membership", label: "Membership", icon: "crown" },
  { href: "/settings/profile", label: "Settings", icon: "settings" },
];

const ADMIN: NavEntry[] = [
  { href: "/admin/moderation", label: "Moderation", icon: "lock" },
];

function NavLink({ entry, active }: { entry: NavEntry; active: boolean }) {
  return (
    <Link href={entry.href} className={"nav-item" + (active ? " active" : "")}>
      <Icon name={entry.icon} className="nav-icon" />
      <span>{entry.label}</span>
      {entry.count != null && <span className="count">{entry.count}</span>}
    </Link>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar() {
  const pathname = usePathname() ?? "";
  const { data: session } = useSession();
  const displayName = session?.user?.displayName ?? "Guest";
  const username = session?.user?.username ?? "—";
  const initials = displayName
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="sidebar">
      <Brand />
      <div className="nav-section">
        {PRIMARY.map((entry) => (
          <NavLink key={entry.href} entry={entry} active={isActive(pathname, entry.href)} />
        ))}
      </div>
      <div className="nav-section">
        <div className="nav-section-label">Account</div>
        {SECONDARY.map((entry) => (
          <NavLink key={entry.href} entry={entry} active={isActive(pathname, entry.href)} />
        ))}
        {session && (
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="nav-item"
            style={{ textAlign: "left" }}
          >
            <Icon name="arrow" className="nav-icon" />
            <span>Sign out</span>
          </button>
        )}
      </div>
      {(session?.user?.roles?.includes("ADMIN") || session?.user?.roles?.includes("MOD")) && (
        <div className="nav-section">
          <div className="nav-section-label">Admin</div>
          {ADMIN.map((entry) => (
            <NavLink key={entry.href} entry={entry} active={isActive(pathname, entry.href)} />
          ))}
        </div>
      )}
      <div className="sidebar-foot">
        <Link href={session ? `/profile/${username}` : "/login"} className="who">
          <div className="who-avatar">{initials || "··"}</div>
          <div className="col" style={{ lineHeight: 1.2 }}>
            <div className="who-name">{displayName}</div>
            <div className="who-sub">@{username} · Creator</div>
          </div>
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;
