"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { papers, tagColors, getAllTags } from "@/data/papers";
import ResearchSection from "@/components/ResearchSection";
import TracksSection from "@/components/TracksSection";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const allTags = useMemo(() => getAllTags(), []);

  const filtered = useMemo(() => {
    return papers.filter((p) => {
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
        p.authors.some((a) => a.toLowerCase().includes(search.toLowerCase()));
      const matchTag = !activeTag || p.tags.includes(activeTag);
      return matchSearch && matchTag;
    });
  }, [search, activeTag]);

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
            <Link href="#papers" className="btn-primary" style={{ display: "inline-block", textDecoration: "none", padding: "14px 32px", fontSize: 16 }}>
              Start Implementing
            </Link>
          </div>
        </div>

        {/* Right side network graphic */}
        <div style={{ flex: "1 1 400px", display: "flex", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "relative", width: 400, height: 400 }}>
            <svg width="100%" height="100%" viewBox="0 0 400 400">
              {/* Edges */}
              <line x1="200" y1="50" x2="300" y2="80" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="200" y1="50" x2="100" y2="150" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="300" y1="80" x2="400" y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="100" y1="150" x2="200" y2="250" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="200" y1="250" x2="300" y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="300" y1="200" x2="400" y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="100" y1="150" x2="100" y2="300" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="100" y1="300" x2="200" y2="350" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="200" y1="250" x2="200" y2="350" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="200" y1="250" x2="300" y2="300" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="300" y1="300" x2="400" y2="350" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="400" y1="200" x2="400" y2="350" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="200" y1="50" x2="200" y2="150" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="300" y1="80" x2="200" y2="150" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="300" y1="200" x2="300" y2="300" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="200" y1="150" x2="300" y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="200" y1="150" x2="100" y2="300" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

              {/* White primary nodes */}
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

              {/* Red and Blue indicator dots moving along paths */}
              <circle r="3" fill="#ef4444">
                <animateMotion dur="3s" repeatCount="indefinite" path="M200,50 L100,150 L200,50" />
              </circle>
              <circle r="3" fill="#3b82f6">
                <animateMotion dur="4s" repeatCount="indefinite" path="M200,50 L300,80 L200,50" />
              </circle>
              <circle r="3" fill="#ef4444">
                <animateMotion dur="3.5s" repeatCount="indefinite" path="M300,80 L400,200 L300,80" />
              </circle>
              <circle r="3" fill="#3b82f6">
                <animateMotion dur="4.5s" repeatCount="indefinite" path="M100,150 L200,250 L100,150" />
              </circle>
              <circle r="3" fill="#ef4444">
                <animateMotion dur="3.2s" repeatCount="indefinite" path="M200,250 L300,200 L200,250" />
              </circle>
              <circle r="3" fill="#3b82f6">
                <animateMotion dur="4.1s" repeatCount="indefinite" path="M300,200 L400,200 L300,200" />
              </circle>
              <circle r="3" fill="#ef4444">
                <animateMotion dur="3.8s" repeatCount="indefinite" path="M100,150 L100,300 L100,150" />
              </circle>
              <circle r="3" fill="#3b82f6">
                <animateMotion dur="4.2s" repeatCount="indefinite" path="M100,300 L200,350 L100,300" />
              </circle>
              <circle r="3" fill="#ef4444">
                <animateMotion dur="3.6s" repeatCount="indefinite" path="M200,250 L200,350 L200,250" />
              </circle>
              <circle r="3" fill="#3b82f6">
                <animateMotion dur="4.7s" repeatCount="indefinite" path="M200,250 L300,300 L200,250" />
              </circle>
              <circle r="3" fill="#ef4444">
                <animateMotion dur="3.3s" repeatCount="indefinite" path="M300,300 L400,350 L300,300" />
              </circle>
              <circle r="3" fill="#3b82f6">
                <animateMotion dur="4.8s" repeatCount="indefinite" path="M400,200 L400,350 L400,200" />
              </circle>
              <circle r="3" fill="#ef4444">
                <animateMotion dur="3.9s" repeatCount="indefinite" path="M200,50 L200,150 L200,50" />
              </circle>
              <circle r="3" fill="#3b82f6">
                <animateMotion dur="4.3s" repeatCount="indefinite" path="M300,80 L200,150 L300,80" />
              </circle>
            </svg>
          </div>
        </div>
      </section>

      <ResearchSection />
      <TracksSection />

      {/* Papers Listing Section */}
      <section id="papers" style={{ padding: "80px 0 24px" }}>
        <h2
          style={{
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: 8,
          }}
        >
          Papers
        </h2>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 32 }}>
          Select a paper to start implementing.
        </p>

        {/* Search */}
        <div style={{ marginBottom: 24, position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              fontSize: 16,
              pointerEvents: "none",
            }}
          >
            🔍
          </span>
          <input
            className="search-bar"
            type="text"
            placeholder="Search papers, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Tags */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 32,
            paddingBottom: 24,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`filter-chip ${activeTag === tag ? "filter-chip-active" : ""}`}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Papers Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 20,
          }}
          className="stagger-children"
        >
          {filtered.map((paper) => (
            <Link
              key={paper.slug}
              href={`/papers/${paper.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="paper-card" style={{ height: "100%" }}>
                {/* Top row: year + tags + copy icon */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <span className="year-badge">{paper.year}</span>
                  {paper.tags.map((tag) => (
                    <span
                      key={tag}
                      className="tag-pill"
                      style={{
                        background: `${tagColors[tag] || "#64748b"}22`,
                        color: tagColors[tag] || "#94a3b8",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  <span
                    style={{
                      marginLeft: "auto",
                      color: "var(--text-muted)",
                      fontSize: 14,
                      opacity: 0.5,
                    }}
                  >
                    📋
                  </span>
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    marginBottom: 6,
                    lineHeight: 1.3,
                  }}
                >
                  {paper.title}
                </h3>

                {/* Authors */}
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    marginBottom: 12,
                  }}
                >
                  {paper.authors.join(", ")}
                </p>

                {/* Description */}
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {paper.description}
                </p>

                {/* Bottom: task count */}
                <div
                  style={{
                    marginTop: 16,
                    paddingTop: 12,
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {paper.tasks.length} {paper.tasks.length === 1 ? "task" : "tasks"}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--accent-cyan)",
                      fontWeight: 600,
                    }}
                  >
                    Implement →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "var(--text-muted)",
            }}
          >
            <p style={{ fontSize: 16, marginBottom: 8 }}>No papers found</p>
            <p style={{ fontSize: 13 }}>Try adjusting your search or filters</p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section style={{ padding: "80px 0 120px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 600, marginBottom: 16, letterSpacing: "-0.02em" }}>
          What openPAPER <span style={{ color: "var(--accent-pink)" }}>actually offers</span>
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 18, maxWidth: 600, margin: "0 auto 64px", lineHeight: 1.6 }}>
          openPAPER is a place to practice Research paper implementations, track progress, prepare for interviews, and use tools for Research roles.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, textAlign: "left", marginBottom: 64 }}>
          {[
            {
              title: "Solve paper problems",
              desc: "Implement ML paper ideas in code and check them with built-in tests inside the workspace.",
            },
            {
              title: "Track real progress",
              desc: "Use your profile, progress tracking, leaderboard, and test mode to keep practicing every day.",
            },
            {
              title: "Use the job stack",
              desc: "Search MLE jobs, internships, research internships, and generate cold mails with CV parsing.",
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
          <Link href="#papers" className="btn-primary" style={{ display: "inline-block", textDecoration: "none", padding: "12px 32px", fontSize: 15 }}>
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
