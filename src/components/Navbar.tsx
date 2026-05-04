"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

const navLinks = [
  { href: "/", label: "Problems" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(10, 14, 26, 0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <nav
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: "var(--text-primary)",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--gradient-brand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 16,
              color: "white",
            }}
          >
            P
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }}>
            Pull<span style={{ color: "var(--accent-cyan)" }}>Game</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
          className="nav-links-desktop"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "6px 16px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                  transition: "all 0.2s ease",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Auth area */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {!isLoading && user ? (
            /* Logged in - show user menu */
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  padding: "6px 14px",
                  cursor: "pointer",
                  color: "var(--text-primary)",
                  fontSize: 13,
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: "var(--gradient-brand)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  {user.username[0].toUpperCase()}
                </div>
                {user.username}
                <span style={{ fontSize: 10, opacity: 0.6 }}>▼</span>
              </button>

              {dropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    background: "rgba(17, 24, 39, 0.95)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    padding: 8,
                    minWidth: 180,
                    animation: "slideUp 0.2s ease",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  }}
                >
                  <Link
                    href={`/profile/${user.username}`}
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: "block",
                      padding: "10px 14px",
                      borderRadius: 8,
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      textDecoration: "none",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                      (e.target as HTMLElement).style.color = "var(--text-primary)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.background = "";
                      (e.target as HTMLElement).style.color = "var(--text-secondary)";
                    }}
                  >
                    👤 My Profile
                  </Link>
                  <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                      router.push("/");
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 14px",
                      borderRadius: 8,
                      fontSize: 13,
                      color: "var(--accent-red)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.background = "rgba(239,68,68,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.background = "";
                    }}
                  >
                    🚪 Log out
                  </button>
                </div>
              )}
            </div>
          ) : !isLoading ? (
            /* Not logged in */
            <>
              <Link
                href="/auth/login"
                className="btn-secondary"
                style={{ textDecoration: "none", padding: "8px 20px", fontSize: 13 }}
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="btn-primary"
                style={{ textDecoration: "none", fontSize: 13 }}
              >
                Sign up
              </Link>
            </>
          ) : null}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              fontSize: 24,
              cursor: "pointer",
              padding: 4,
            }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                color: pathname === link.href ? "var(--text-primary)" : "var(--text-secondary)",
                background: pathname === link.href ? "rgba(255,255,255,0.08)" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 768px) {
          .nav-links-desktop {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}
