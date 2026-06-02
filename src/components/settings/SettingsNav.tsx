"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/common/Icon";

type Entry = { href: string; label: string; icon: IconName };

const ENTRIES: Entry[] = [
  { href: "/settings/profile", label: "Profile", icon: "users" },
  { href: "/settings/privacy", label: "Privacy", icon: "lock" },
  { href: "/settings/connected-apps", label: "Connected apps", icon: "grid" },
];

export function SettingsNav() {
  const pathname = usePathname() ?? "";
  return (
    <nav className="settings-nav" aria-label="Settings">
      {ENTRIES.map((entry) => {
        const active = pathname === entry.href || pathname.startsWith(entry.href + "/");
        return (
          <Link
            key={entry.href}
            href={entry.href}
            className={"nav-item" + (active ? " active" : "")}
          >
            <Icon name={entry.icon} className="nav-icon" />
            <span>{entry.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default SettingsNav;
