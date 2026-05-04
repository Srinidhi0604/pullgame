"use client";

import Link from "next/link";
import { useState } from "react";
import { problems } from "@/data/problems";

// Define consistent colors for tags based on their string values
const tagColors = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#10b981", 
  "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef", "#f43f5e"
];

const getTagColor = (tag: string) => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return tagColors[Math.abs(hash) % tagColors.length];
};

// Extract a short summary from the markdown description
function getSummary(description: string) {
  const lines = description.split("\n");
  const bgIndex = lines.findIndex((l) => l.includes("## Background") || l.includes("## The Math") || l.includes("## The Mechanism"));
  if (bgIndex !== -1) {
    // Find the first non-empty line after the heading
    for (let i = bgIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith("#") && !line.startsWith("\`\`\`")) {
        // Strip markdown links if any, simple replace
        return line.substring(0, 150) + (line.length > 150 ? "..." : "");
      }
    }
  }
  return description.substring(0, 150) + "...";
}

export default function PapersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = Array.from(new Set(problems.flatMap((p) => p.tags))).sort();

  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.paper.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = activeTag ? p.tags.includes(activeTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 100px" }} className="animate-fade-in">
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Papers</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 16 }}>Select a paper to start implementing.</p>
      </div>

      {/* Search Bar */}
      <div style={{ position: "relative", marginBottom: 24 }}>
        <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search papers, tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "16px 16px 16px 48px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            color: "var(--text-primary)",
            fontSize: 15,
            outline: "none",
            transition: "border-color 0.2s"
          }}
          onFocus={(e) => e.target.style.borderColor = "rgba(255,255,255,0.2)"}
          onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
        />
      </div>

      {/* Tags Filter */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
        <span style={{ color: "var(--text-muted)", fontSize: 14 }}>Filter by:</span>
        <button
          onClick={() => setActiveTag(null)}
          style={{
            padding: "4px 12px",
            borderRadius: 16,
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            background: activeTag === null ? "rgba(255,255,255,0.1)" : "transparent",
            color: activeTag === null ? "var(--text-primary)" : "var(--text-secondary)",
            border: "none",
            transition: "all 0.2s"
          }}
        >
          All
        </button>
        {allTags.map(tag => {
          const color = getTagColor(tag);
          return (
          <button
            key={tag}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            style={{
              padding: "4px 12px",
              borderRadius: 16,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              background: activeTag === tag ? `${color}30` : "transparent",
              color: activeTag === tag ? color : "var(--text-secondary)",
              border: `1px solid ${activeTag === tag ? color : "transparent"}`,
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              if (activeTag !== tag) {
                e.currentTarget.style.color = color;
                e.currentTarget.style.background = `${color}15`;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTag !== tag) {
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            {tag}
          </button>
        )})}
      </div>

      {/* Problems Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 24 }} className="stagger-children">
        {filteredProblems.map((problem) => (
          <Link href={`/problems/${problem.slug}`} key={problem.slug} style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: 24,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              {/* Card Header Tags */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
                {problem.tags.map(tag => {
                  const color = getTagColor(tag);
                  return (
                  <span
                    key={tag}
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 12,
                      background: `${color}15`,
                      color: color,
                      border: `1px solid ${color}30`
                    }}
                  >
                    {tag}
                  </span>
                )})}
                <div style={{ marginLeft: "auto", color: "var(--text-muted)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
              </div>

              <h3 style={{ fontSize: 20, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8, lineHeight: 1.3 }}>
                {problem.title}
              </h3>
              
              {/* Parse author/year loosely if possible, or just render paper */}
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
                {problem.paper.replace(/\(.*\)/, "").trim() || problem.paper}
              </p>

              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5, marginTop: "auto" }}>
                {getSummary(problem.description)}
              </p>
            </div>
          </Link>
        ))}
      </div>
      
      {filteredProblems.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          <p>No papers found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
