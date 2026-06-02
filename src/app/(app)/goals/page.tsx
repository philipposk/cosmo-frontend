import { getServerSession } from "@/lib/auth/server";
import { env } from "@/lib/env";
import type { Goal } from "@/lib/api/goals";
import { GoalsBoard } from "@/components/goals/GoalsBoard";
import { GuestPrompt } from "@/components/common/GuestPrompt";

async function loadGoals(token: string): Promise<Goal[]> {
  try {
    const res = await fetch(`${env.backendApiUrl}/goals`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    return (await res.json()) as Goal[];
  } catch {
    return [];
  }
}

export default async function GoalsPage() {
  const session = await getServerSession();
  const token = session?.user?.token ?? null;
  const goals = token ? await loadGoals(token) : [];

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Care &amp; progress</div>
          <h1 className="display">Goals</h1>
          <p className="sub">
            Quiet, optional tracking. Share with a teacher or caretaker when you want; keep it private otherwise.
          </p>
        </div>
      </div>
      {!token ? (
        <GuestPrompt action="track your goals" callbackUrl="/goals" />
      ) : (
        <GoalsBoard token={token} initial={goals} />
      )}
    </div>
  );
}
