import Link from "next/link";
import { env } from "@/lib/env";

type Props = { searchParams: Promise<{ token?: string }> };

async function confirm(token: string): Promise<{ ok: boolean; message?: string }> {
  try {
    const res = await fetch(`${env.backendApiUrl}/auth/confirm-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      cache: "no-store",
    });
    if (res.ok) return { ok: true };
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    return { ok: false, message: body.message ?? `${res.status} ${res.statusText}` };
  } catch (err) {
    return { ok: false, message: (err as Error).message };
  }
}

export default async function ConfirmPage({ searchParams }: Props) {
  const params = await searchParams;
  const token = params.token ?? "";
  if (!token) {
    return (
      <div className="content" style={{ maxWidth: 520, margin: "0 auto" }}>
        <h1 className="display">Missing token</h1>
        <p className="sub">Open the link from your confirmation email.</p>
      </div>
    );
  }
  const result = await confirm(token);

  return (
    <div className="content" style={{ maxWidth: 520, margin: "0 auto" }}>
      <div className="eyebrow">Email confirmation</div>
      <h1 className="display">{result.ok ? "Email confirmed." : "Could not confirm."}</h1>
      <p className="sub">{result.ok ? "You can close this tab or head to your dashboard." : result.message}</p>
      <div style={{ marginTop: 18 }}>
        <Link href={result.ok ? "/dashboard" : "/login"} className="btn btn-primary">
          {result.ok ? "Go to Cosmo" : "Back to sign in"}
        </Link>
      </div>
    </div>
  );
}
