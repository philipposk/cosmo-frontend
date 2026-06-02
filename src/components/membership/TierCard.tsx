"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/session";
import { MembershipTier, createCheckoutSession } from "@/lib/api/membership";
import { formatCurrency } from "@/lib/number-format";

type TierCardProps = {
  tier: MembershipTier;
  isCurrent: boolean;
};

export function TierCard({ tier, isCurrent }: TierCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (isCurrent) {
      return;
    }
    if (!session?.user?.token) {
      setError("You need to sign in again to upgrade your membership.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const checkout = await createCheckoutSession(
        { tierSlug: tier.slug },
        session.user.token,
      );
      if (checkout.url) {
        window.location.href = checkout.url;
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start checkout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">{tier.name}</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            {formatCurrency(tier.priceCents / 100, tier.currency)}
            <span className="text-sm font-medium text-slate-500">/month</span>
          </h3>
        </div>
        {tier.description ? <p className="text-sm text-slate-600">{tier.description}</p> : null}
        <ul className="space-y-2 text-sm text-slate-600">
          <li>• Up to {tier.maxStoriesPerDay} stories per day</li>
          <li>• {tier.maxWordsPerStory.toLocaleString()} words per story</li>
          <li>• Priority level {tier.priorityLevel}</li>
          <li>• Models: {tier.availableModels.join(", ") || "All available"}</li>
        </ul>
      </div>

      <div className="mt-6 space-y-2">
        <button
          onClick={handleCheckout}
          disabled={isCurrent || isLoading}
          className="w-full rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isCurrent ? "Current plan" : isLoading ? "Redirecting…" : "Upgrade"}
        </button>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </div>
    </div>
  );
}

