import Link from "next/link";
import { Icon } from "@/components/common/Icon";

export default function OnboardingWelcomePage() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "32px 16px" }}>
      <div style={{ width: "100%", maxWidth: 640 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>You&apos;re in</div>
        <h1 className="display" style={{ fontSize: 56, lineHeight: 1, margin: 0 }}>
          Welcome to <em>Cosmo.</em>
        </h1>
        <p className="sub" style={{ marginTop: 12, maxWidth: 520 }}>
          A quiet creative home for stories, libraries, forums, and goals. Pick where to start — you can change everything
          later.
        </p>

        <div className="continue-strip" style={{ marginTop: 28 }}>
          <Link href="/settings/profile" className="continue-card">
            <div className="kind"><Icon name="users" size={11} /> Step 1</div>
            <h4>Set up your profile</h4>
            <div className="progress"><span style={{ width: "0%" }} /></div>
          </Link>
          <Link href="/forums" className="continue-card">
            <div className="kind"><Icon name="chat" size={11} /> Step 2</div>
            <h4>Visit a forum</h4>
            <div className="progress"><span style={{ width: "0%" }} /></div>
          </Link>
          <Link href="/dashboard" className="continue-card">
            <div className="kind"><Icon name="home" size={11} /> Step 3</div>
            <h4>Share your first post</h4>
            <div className="progress"><span style={{ width: "0%" }} /></div>
          </Link>
        </div>

        <div className="row" style={{ marginTop: 22, gap: 10 }}>
          <Link href="/dashboard" className="btn btn-primary">
            <Icon name="arrow" size={14} /> Open dashboard
          </Link>
          <Link href="/settings/connected-apps" className="btn btn-ghost">
            <Icon name="grid" size={14} /> Connected apps
          </Link>
        </div>
      </div>
    </div>
  );
}
