import "server-only";
import { getServerSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { listConnectedApps, type ConnectedAppEntry } from "@/lib/api/connected-apps";
import { ConnectedAppsList } from "@/components/settings/ConnectedAppsList";

export default async function ConnectedAppsPage() {
  const session = await getServerSession();
  if (!session?.user?.token) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/settings/connected-apps")}`);
  }

  const token = session.user.token;
  let apps: ConnectedAppEntry[] = [];
  let loadError: string | null = null;
  try {
    apps = await listConnectedApps(token);
  } catch (err) {
    loadError = (err as Error).message;
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Account</div>
          <h1 className="display">
            Connected <em>apps</em>
          </h1>
          <p className="sub">
            Cosmo plugs into a few sibling apps in your workspace. AI OS already powers your generations. The rest are
            reserved seams — connect them when the integration ships.
          </p>
        </div>
      </div>

      {loadError && (
        <div className="card-flat" style={{ marginBottom: 18, color: "var(--mute)" }}>
          Could not load app status: {loadError}
        </div>
      )}

      <ConnectedAppsList token={token} initial={apps} />
    </div>
  );
}
