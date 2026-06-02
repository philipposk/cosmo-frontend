"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "@/lib/auth/session";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/stories", label: "Stories" },
  { href: "/membership", label: "Membership" },
  { href: "/libraries", label: "Libraries" },
  { href: "/forums", label: "Forums" },
  { href: "/goals", label: "Goals" },
  { href: "/settings/profile", label: "Settings" },
];

export const TopNav = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm text-white">
            ✶
          </span>
          Cosmo
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition hover:text-slate-900 ${isActive ? "text-slate-900" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link
                href={`/profile/${session.user.username}`}
                className="hidden rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 md:inline-flex"
              >
                {session.user.displayName}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-200"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-200"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

