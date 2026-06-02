import Link from "next/link";
import { Icon } from "./Icon";

type Props = {
  action?: string; // e.g. "post stories", "track goals"
  callbackUrl?: string;
};

export function GuestPrompt({ action = "access this", callbackUrl }: Props) {
  const loginHref = callbackUrl
    ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/login";

  return (
    <div
      className="card"
      style={{ textAlign: "center", padding: "40px 32px" }}
    >
      <div style={{ marginBottom: 12 }}>
        <Icon name="lock" size={28} style={{ color: "var(--mute)" }} />
      </div>
      <h3
        style={{
          fontFamily: "var(--display)",
          fontWeight: 400,
          fontSize: 24,
          margin: "0 0 10px",
        }}
      >
        Sign in to {action}
      </h3>
      <p style={{ color: "var(--mute)", margin: "0 0 22px" }}>
        Cosmo is free to join. No algorithm. No noise.
      </p>
      <div className="row" style={{ justifyContent: "center", gap: 10 }}>
        <Link href="/register" className="btn btn-primary">
          <Icon name="sparkle" size={13} /> Create account
        </Link>
        <Link href={loginHref} className="btn btn-ghost">
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default GuestPrompt;
