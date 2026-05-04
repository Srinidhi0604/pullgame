import Link from "next/link";

export function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "40px 24px",
        marginTop: 80,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "var(--gradient-brand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 14,
              color: "white",
            }}
          >
            P
          </div>
          <span style={{ fontWeight: 600, fontSize: 15, color: "var(--text-secondary)" }}>
            PullGame
          </span>
        </div>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[
            { href: "/", label: "Problems" },
            { href: "/leaderboard", label: "Leaderboard" },
            { href: "/reviews", label: "Reviews" },
            { href: "/about", label: "About" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: "var(--text-muted)",
                textDecoration: "none",
                fontSize: 13,
                transition: "color 0.2s ease",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p style={{ color: "var(--text-muted)", fontSize: 12 }}>
          © 2025 PullGame. Implement papers, not just read them.
        </p>
      </div>
    </footer>
  );
}
