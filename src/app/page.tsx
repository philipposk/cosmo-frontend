import Link from "next/link";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--ink)" }}>

      {/* ── Nav ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(20px, 5vw, 64px)",
        height: 60,
        borderBottom: "1px solid var(--line)",
        background: "var(--bg)",
        backdropFilter: "blur(8px)",
      }}>
        <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.03em" }}>✦ Cosmo</span>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/login" style={{
            padding: "7px 16px", borderRadius: 8,
            border: "1px solid var(--line)",
            fontSize: 14, fontWeight: 500,
            color: "var(--mute)", textDecoration: "none",
          }}>Sign in</Link>
          <Link href="/register" style={{
            padding: "7px 16px", borderRadius: 8,
            background: "var(--accent)", color: "#fff",
            fontSize: 14, fontWeight: 600,
            textDecoration: "none",
          }}>Join free</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        maxWidth: 760, margin: "0 auto",
        padding: "80px clamp(20px, 5vw, 40px) 64px",
        textAlign: "center",
      }}>
        <div style={{
          display: "inline-block",
          padding: "4px 14px", borderRadius: 99,
          background: "color-mix(in srgb, var(--accent) 12%, transparent)",
          color: "var(--accent-ink)", fontSize: 13, fontWeight: 600,
          marginBottom: 24, letterSpacing: "0.02em",
        }}>
          Write · Draw · Learn · Share
        </div>

        <h1 style={{
          fontSize: "clamp(36px, 6vw, 64px)",
          fontWeight: 800, lineHeight: 1.05,
          letterSpacing: "-0.04em", margin: "0 0 24px",
        }}>
          A creative home<br />
          <em style={{ fontStyle: "italic", color: "var(--accent-ink)" }}>without the noise.</em>
        </h1>

        <p style={{
          fontSize: "clamp(16px, 2.5vw, 20px)",
          color: "var(--mute)", lineHeight: 1.65,
          maxWidth: 520, margin: "0 auto 40px",
        }}>
          Post stories. Curate libraries. Join slow forums. Track goals.
          AI built in — so you spend time making, not fighting the tools.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/register" style={{
            padding: "14px 32px", borderRadius: 10,
            background: "var(--accent)", color: "#fff",
            fontSize: 16, fontWeight: 700, textDecoration: "none",
            boxShadow: "0 4px 20px color-mix(in srgb, var(--accent) 35%, transparent)",
          }}>Start for free</Link>
          <Link href="/dashboard" style={{
            padding: "14px 32px", borderRadius: 10,
            border: "1.5px solid var(--line)",
            fontSize: 16, fontWeight: 600, textDecoration: "none",
            color: "var(--ink)",
          }}>Browse as guest →</Link>
        </div>

        <p style={{ marginTop: 16, fontSize: 13, color: "var(--mute)" }}>
          No credit card. No algorithm. No ads.
        </p>
      </section>

      {/* ── Feature cards ── */}
      <section style={{
        maxWidth: 1100, margin: "0 auto",
        padding: "0 clamp(20px, 5vw, 40px) 80px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 20,
      }}>
        {[
          {
            icon: "✍️",
            title: "Stories with AI",
            body: "Start a draft. Ask the AI for a paragraph, a twist, or a full outline. Publish when it's yours.",
            cta: "Write a story →",
            href: "/stories/new",
          },
          {
            icon: "📚",
            title: "Personal libraries",
            body: "Collect books, podcasts, films, art. Share your list publicly or keep it private.",
            cta: "See libraries →",
            href: "/libraries",
          },
          {
            icon: "💬",
            title: "Slow forums",
            body: "Threaded spaces around topics you care about. No hot takes, no viral race.",
            cta: "Join a forum →",
            href: "/forums",
          },
          {
            icon: "🎯",
            title: "Goals & progress",
            body: "Set a writing goal, a reading target, a skill to learn. Track quietly or share with someone.",
            cta: "Set a goal →",
            href: "/goals",
          },
        ].map((f) => (
          <Link key={f.title} href={f.href} className="landing-feature-card">
            <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 8px", color: "var(--ink)" }}>{f.title}</h3>
            <p style={{ fontSize: 14, color: "var(--mute)", lineHeight: 1.6, margin: "0 0 16px" }}>{f.body}</p>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--accent-ink)" }}>{f.cta}</span>
          </Link>
        ))}
      </section>

      {/* ── Social proof / tone strip ── */}
      <section style={{
        borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)",
        padding: "40px clamp(20px, 5vw, 64px)",
        display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "center",
        background: "color-mix(in srgb, var(--accent) 4%, var(--bg))",
      }}>
        {[
          ["No algorithm", "Your feed is chronological. Nothing is boosted."],
          ["AI that helps", "Not AI that posts for you. You stay the author."],
          ["Privacy first", "Public, friends-only, or private — you choose per post."],
        ].map(([label, desc]) => (
          <div key={label} style={{ textAlign: "center", maxWidth: 200 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 13, color: "var(--mute)", lineHeight: 1.5 }}>{desc}</div>
          </div>
        ))}
      </section>

      {/* ── CTA bottom ── */}
      <section style={{
        textAlign: "center",
        padding: "80px clamp(20px, 5vw, 40px)",
      }}>
        <h2 style={{
          fontSize: "clamp(26px, 4vw, 44px)",
          fontWeight: 800, letterSpacing: "-0.03em",
          margin: "0 0 16px",
        }}>Ready to start making things?</h2>
        <p style={{ color: "var(--mute)", fontSize: 16, marginBottom: 32 }}>
          Free forever for personal use. No card required.
        </p>
        <Link href="/register" style={{
          padding: "16px 40px", borderRadius: 10,
          background: "var(--accent)", color: "#fff",
          fontSize: 17, fontWeight: 700, textDecoration: "none",
          boxShadow: "0 4px 24px color-mix(in srgb, var(--accent) 35%, transparent)",
        }}>Create your account</Link>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: "1px solid var(--line)",
        padding: "20px clamp(20px, 5vw, 64px)",
        display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        fontSize: 13, color: "var(--mute)",
      }}>
        <span>✦ Cosmo — part of the <a href="https://6x7.gr" style={{ color: "var(--mute)" }}>6x7.gr</a> family</span>
        <div style={{ display: "flex", gap: 20 }}>
          <Link href="/forums" style={{ color: "var(--mute)", textDecoration: "none" }}>Forums</Link>
          <Link href="/stories" style={{ color: "var(--mute)", textDecoration: "none" }}>Stories</Link>
          <Link href="/login" style={{ color: "var(--mute)", textDecoration: "none" }}>Sign in</Link>
        </div>
      </footer>

    </main>
  );
}
