"use client";

import Link from "next/link";
import ResearchSection from "@/components/ResearchSection";
import TracksSection from "@/components/TracksSection";

export default function HomePage() {

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
      {/* Hero Section */}
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "100px 0 80px",
          minHeight: "80vh",
          flexWrap: "wrap",
          gap: 40,
        }}
        className="animate-fade-in"
      >
        <div style={{ flex: "1 1 500px", maxWidth: 500 }}>
          <h1
            style={{
              fontSize: "clamp(48px, 5vw, 64px)",
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 24,
            }}
          >
            Don't just read the paper. Compile it.
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "var(--text-secondary)",
              marginBottom: 40,
              lineHeight: 1.6,
            }}
          >
            Bridge the gap between theory and reality. Implement state-of-the-art models{" "}
            <span
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "2px 6px",
                borderRadius: 4,
                color: "var(--text-primary)",
              }}
            >
              from scratch
            </span>
            , line by line.
          </p>

          <div>
            <Link href="/papers" className="btn-minimalist">
              Start Implementing
            </Link>
          </div>
        </div>

        {/* Right side network graphic */}
        <div style={{ flex: "1 1 400px", display: "flex", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "relative", width: 400, height: 400 }}>
            <svg width="100%" height="100%" viewBox="0 0 400 400" style={{ overflow: "visible" }}>
              {/* Edges */}
              <line x1="200" y1="50" x2="300" y2="80" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <line x1="200" y1="50" x2="100" y2="150" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <line x1="300" y1="80" x2="400" y2="200" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <line x1="100" y1="150" x2="200" y2="250" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <line x1="200" y1="250" x2="300" y2="200" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <line x1="300" y1="200" x2="400" y2="200" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <line x1="100" y1="150" x2="100" y2="300" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <line x1="100" y1="300" x2="200" y2="350" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <line x1="200" y1="250" x2="200" y2="350" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <line x1="200" y1="250" x2="300" y2="300" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <line x1="300" y1="300" x2="400" y2="350" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <line x1="400" y1="200" x2="400" y2="350" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <line x1="200" y1="50" x2="200" y2="150" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <line x1="300" y1="80" x2="200" y2="150" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <line x1="300" y1="200" x2="300" y2="300" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <line x1="200" y1="150" x2="300" y2="200" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <line x1="200" y1="150" x2="100" y2="300" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

              {/* Red and Blue indicator dots moving along paths (Shortened to not touch nodes) */}
              <circle r="3" fill="#ef4444">
                <animateMotion dur="3s" repeatCount="indefinite" path="M191.5,58.5 L108.5,141.5 L191.5,58.5" />
              </circle>
              <circle r="3" fill="#3b82f6">
                <animateMotion dur="4s" repeatCount="indefinite" path="M211.5,53.5 L288.5,76.5 L211.5,53.5" />
              </circle>
              <circle r="3" fill="#ef4444">
                <animateMotion dur="3.5s" repeatCount="indefinite" path="M307.7,89.2 L392.3,190.8 L307.7,89.2" />
              </circle>
              <circle r="3" fill="#3b82f6">
                <animateMotion dur="4.5s" repeatCount="indefinite" path="M108.5,158.5 L191.5,241.5 L108.5,158.5" />
              </circle>
              <circle r="3" fill="#ef4444">
                <animateMotion dur="3.2s" repeatCount="indefinite" path="M210.7,244.6 L289.3,205.4 L210.7,244.6" />
              </circle>
              <circle r="3" fill="#3b82f6">
                <animateMotion dur="4.1s" repeatCount="indefinite" path="M312,200 L388,200 L312,200" />
              </circle>
              <circle r="3" fill="#ef4444">
                <animateMotion dur="3.8s" repeatCount="indefinite" path="M100,162 L100,288 L100,162" />
              </circle>
              <circle r="3" fill="#3b82f6">
                <animateMotion dur="4.2s" repeatCount="indefinite" path="M110.7,305.4 L189.3,344.6 L110.7,305.4" />
              </circle>
              <circle r="3" fill="#ef4444">
                <animateMotion dur="3.6s" repeatCount="indefinite" path="M200,262 L200,338 L200,262" />
              </circle>
              <circle r="3" fill="#3b82f6">
                <animateMotion dur="4.7s" repeatCount="indefinite" path="M210.7,255.4 L289.3,294.6 L210.7,255.4" />
              </circle>
              <circle r="3" fill="#ef4444">
                <animateMotion dur="3.3s" repeatCount="indefinite" path="M310.7,305.4 L389.3,344.6 L310.7,305.4" />
              </circle>
              <circle r="3" fill="#3b82f6">
                <animateMotion dur="4.8s" repeatCount="indefinite" path="M400,212 L400,338 L400,212" />
              </circle>
              <circle r="3" fill="#ef4444">
                <animateMotion dur="3.9s" repeatCount="indefinite" path="M200,62 L200,138 L200,62" />
              </circle>
              <circle r="3" fill="#3b82f6">
                <animateMotion dur="4.3s" repeatCount="indefinite" path="M290,87 L210,143 L290,87" />
              </circle>
              <circle r="3" fill="#ef4444">
                <animateMotion dur="3.4s" repeatCount="indefinite" path="M300,212 L300,288 L300,212" />
              </circle>
              <circle r="3" fill="#3b82f6">
                <animateMotion dur="4.6s" repeatCount="indefinite" path="M210.7,155.4 L289.3,194.6 L210.7,155.4" />
              </circle>
              <circle r="3" fill="#ef4444">
                <animateMotion dur="3.7s" repeatCount="indefinite" path="M193.4,159.9 L106.6,290.1 L193.4,159.9" />
              </circle>

              {/* White primary nodes (Rendered ON TOP) */}
              <circle cx="200" cy="50" r="7" fill="white" />
              <circle cx="300" cy="80" r="7" fill="white" />
              <circle cx="100" cy="150" r="7" fill="white" />
              <circle cx="200" cy="150" r="7" fill="white" />
              <circle cx="400" cy="200" r="7" fill="white" />
              <circle cx="100" cy="300" r="7" fill="white" />
              <circle cx="200" cy="250" r="7" fill="white" />
              <circle cx="300" cy="200" r="7" fill="white" />
              <circle cx="200" cy="350" r="7" fill="white" />
              <circle cx="300" cy="300" r="7" fill="white" />
              <circle cx="400" cy="350" r="7" fill="white" />
            </svg>
          </div>
        </div>
      </section>

      <ResearchSection />
      <TracksSection />

      {/* Features Section */}
      <section style={{ padding: "80px 0 120px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 600, marginBottom: 16, letterSpacing: "-0.02em" }}>
          What PaperLabs <span style={{ color: "var(--accent-pink)" }}>actually offers</span>
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 18, maxWidth: 600, margin: "0 auto 64px", lineHeight: 1.6 }}>
          PaperLabs is a place to practice Research paper implementations, track progress, prepare for interviews, and use tools for Research roles.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, textAlign: "left", marginBottom: 64 }}>
          {[
            {
              title: "Solve paper problems",
              desc: "Implement Research Paper ideas in code and check them with built-in tests inside the workspace.",
            },
            {
              title: "Track real progress",
              desc: "Use your profile, progress tracking, leaderboard, and test mode to keep practicing every day.",
            },
            {
              title: "Be Job Ready",
              desc: "Companies like Google Deepmind and meta dont want people who just mug up research papers, they need people who can implement them. Learn that with us!",
            },
            {
              title: "Unlock paid tools",
              desc: "Paid plans add professor contacts and specialized roadmaps like Embedded AI, CV, RL, and AI Engineering.",
            }
          ].map((feature, i) => (
            <div key={i} style={{ padding: 32, borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.05)", borderRadius: 8, color: "var(--text-muted)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 500, fontFamily: "var(--font-mono)" }}>{feature.title}</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>{feature.desc}</p>
            </div>
          ))}
        </div>

        <div>
          <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>Already used by 20+ paid users and seeing 200+ submissions daily.</p>
          <Link href="/papers" className="btn-primary" style={{ display: "inline-block", textDecoration: "none", padding: "12px 32px", fontSize: 15 }}>
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
