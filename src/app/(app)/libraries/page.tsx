import { getServerSession } from "@/lib/auth/server";
import { env } from "@/lib/env";
import type { LibraryItem } from "@/lib/api/libraries";
import { LibraryBoard } from "@/components/libraries/LibraryBoard";
import { GuestPrompt } from "@/components/common/GuestPrompt";

async function load(token: string): Promise<LibraryItem[]> {
  try {
    const res = await fetch(`${env.backendApiUrl}/libraries/me`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    return (await res.json()) as LibraryItem[];
  } catch {
    return [];
  }
}

export default async function LibrariesPage() {
  const session = await getServerSession();
  const token = session?.user?.token ?? null;
  const items = token ? await load(token) : [];

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Personal collection</div>
          <h1 className="display">Libraries</h1>
          <p className="sub">
            Save published work, references, and inspiration. Items marked Public surface on your profile and in search.
          </p>
        </div>
      </div>
      {!token ? (
        <GuestPrompt action="build your library" callbackUrl="/libraries" />
      ) : (
        <LibraryBoard token={token} initial={items} />
      )}
    </div>
  );
}
