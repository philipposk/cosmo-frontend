import { getServerSession } from "@/lib/auth/server";
import Link from "next/link";
import { TierCard } from "@/components/membership/TierCard";
import { env } from "@/lib/env";
import type { MembershipTier, UserMembership } from "@/lib/api/membership";
import { Icon } from "@/components/common/Icon";

async function fetchTiers(): Promise<MembershipTier[]> {
  try {
    const res = await fetch(`${env.backendApiUrl}/membership/tiers`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as MembershipTier[];
  } catch {
    return [];
  }
}

async function fetchMembership(token: string): Promise<UserMembership | null> {
  try {
    const res = await fetch(`${env.backendApiUrl}/membership/me`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text.trim() ? (JSON.parse(text) as UserMembership) : null;
  } catch {
    return null;
  }
}

export default async function MembershipPage() {
  const session = await getServerSession();
  const token = session?.user?.token ?? null;

  const tiers = await fetchTiers();
  const membership = token ? await fetchMembership(token) : null;
  const currentTierId = membership?.tier?.id ?? null;

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Plans</div>
          <h1 className="display">Membership</h1>
          <p className="sub">
            Unlock more AI generation, longer stories, and priority support. Upgrades take effect
            immediately and can be cancelled any time.
          </p>
        </div>
      </div>

      {membership && (
        <div className="card-flat" style={{ marginBottom: 22, color: "var(--cool)" }}>
          <div className="row" style={{ gap: 10 }}>
            <Icon name="star" size={16} />
            <span>
              Current plan: <b>{membership.tier.name}</b>
              {membership.currentPeriodEnd &&
                ` · renews ${new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
                  new Date(membership.currentPeriodEnd),
                )}`}
            </span>
          </div>
        </div>
      )}

      {!session && (
        <div className="card-flat" style={{ marginBottom: 22 }}>
          <div className="row" style={{ gap: 10 }}>
            <Icon name="lock" size={16} style={{ color: "var(--mute)" }} />
            <span style={{ color: "var(--mute)" }}>
              <Link href="/register" style={{ color: "var(--accent-ink)", fontWeight: 500 }}>
                Create an account
              </Link>{" "}
              or{" "}
              <Link href="/login" style={{ color: "var(--accent-ink)", fontWeight: 500 }}>
                sign in
              </Link>{" "}
              to subscribe.
            </span>
          </div>
        </div>
      )}

      <div className="tier-grid">
        {tiers.map((tier) => (
          <TierCard key={tier.id} tier={tier} isCurrent={tier.id === currentTierId} />
        ))}
      </div>
    </div>
  );
}
