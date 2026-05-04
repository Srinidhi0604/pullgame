"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  
  // Only show footer on main navigation pages
  const allowedPaths = ["/", "/papers", "/fundamentals", "/advanced-tracks", "/leaderboard", "/pricing"];
  if (!allowedPaths.includes(pathname)) return null;

  return (
    <footer
      style={{
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid #222",
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
        {/* Logo area */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 16, color: "var(--text-muted)", letterSpacing: "-0.05em" }}>
            &gt;_
          </span>
          <span style={{ fontWeight: 600, fontSize: 15, color: "var(--text-secondary)", letterSpacing: "-0.02em" }}>
            openPAPER
          </span>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[
            { href: "/papers", label: "Papers" },
            { href: "/fundamentals", label: "Fundamentals" },
            { href: "/advanced-tracks", label: "Tracks" },
            { href: "/leaderboard", label: "Leaderboard" },
            { href: "/pricing", label: "Pricing" },
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
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <p style={{ color: "#666", fontSize: 12, margin: 0 }}>
          © {new Date().getFullYear()} openPAPER.
        </p>
      </div>
    </footer>
  );
}
