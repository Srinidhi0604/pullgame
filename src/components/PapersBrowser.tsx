"use client";

import Link from "next/link";
import { useState } from "react";
import { papers, type PaperTrack } from "@/data/papers";

type ActiveTrack = PaperTrack | "all";

interface PapersBrowserProps {
  initialTrack: ActiveTrack;
}

const tagColors = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#84cc16",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#d946ef",
  "#f43f5e",
];

const trackLabels: Record<ActiveTrack, string> = {
  all: "All",
  ml: "Machine Learning",
  biology: "Biology & Chemistry",
  hardware: "Hardware",
};

const getTagColor = (tag: string) => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return tagColors[Math.abs(hash) % tagColors.length];
};

function getSummary(description: string) {
  const lines = description.split("\n");
  const bgIndex = lines.findIndex((line) =>
    line.includes("## Background") || line.includes("## The Math") || line.includes("## The Mechanism") || line.includes("## Problem Description")
  );

  if (bgIndex !== -1) {
    for (let i = bgIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith("#") && !line.startsWith("```")) {
        return line.substring(0, 150) + (line.length > 150 ? "..." : "");
      }
    }
  }

  return description.substring(0, 150) + "...";
}

function getTrack(paperTrack: PaperTrack | undefined): PaperTrack {
  return paperTrack ?? "ml";
}

export function PapersBrowser({ initialTrack }: PapersBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeTrack, setActiveTrack] = useState<ActiveTrack>(initialTrack);

  const trackFilteredPapers = papers.filter((paper) => activeTrack === "all" || getTrack(paper.track) === activeTrack);
  const allTags = Array.from(new Set(trackFilteredPapers.flatMap((paper) => paper.tags))).sort();

  const filteredPapers = trackFilteredPapers.filter((paper) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      paper.title.toLowerCase().includes(query) ||
      paper.description.toLowerCase().includes(query) ||
      paper.authors.some((author) => author.toLowerCase().includes(query)) ||
      paper.tags.some((tag) => tag.toLowerCase().includes(query));
    const matchesTag = activeTag ? paper.tags.includes(activeTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 100px" }} className="animate-fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Papers</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 16 }}>
          Select a paper to start implementing.
        </p>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
        {(Object.keys(trackLabels) as ActiveTrack[]).map((track) => (
          <button
            key={track}
            onClick={() => {
              setActiveTrack(track);
              setActiveTag(null);
            }}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              background: activeTrack === track ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.03)",
              color: activeTrack === track ? "var(--text-primary)" : "var(--text-secondary)",
              border: activeTrack === track ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {trackLabels[track]}
          </button>
        ))}
      </div>

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
          onChange={(event) => setSearchQuery(event.target.value)}
          style={{
            width: "100%",
            padding: "16px 16px 16px 48px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            color: "var(--text-primary)",
            fontSize: 15,
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(event) => {
            event.target.style.borderColor = "rgba(255,255,255,0.2)";
          }}
          onBlur={(event) => {
            event.target.style.borderColor = "rgba(255,255,255,0.08)";
          }}
        />
      </div>

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
          }}
        >
          All
        </button>
        {allTags.map((tag) => {
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
                transition: "all 0.2s",
              }}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 24 }} className="stagger-children">
        {filteredPapers.map((paper) => (
          <Link href={`/papers/${paper.slug}`} key={paper.slug} style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: 24,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.transform = "translateY(-2px)";
                event.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.transform = "translateY(0)";
                event.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
                <span className="year-badge" style={{ padding: "2px 8px", borderRadius: 12, background: "rgba(255,255,255,0.1)", fontSize: 11, fontWeight: 600 }}>
                  {paper.year}
                </span>
                {paper.tags.slice(0, 4).map((tag) => {
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
                        color,
                        border: `1px solid ${color}30`,
                      }}
                    >
                      {tag}
                    </span>
                  );
                })}
                <div style={{ marginLeft: "auto", color: paper.visual ? "var(--accent-cyan)" : "var(--text-muted)" }}>
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
                {paper.title}
              </h3>

              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
                {paper.authors.join(", ")}
              </p>

              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5, marginTop: "auto", marginBottom: 16 }}>
                {getSummary(paper.description)}
              </p>

              <div style={{ paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {paper.tasks.length} {paper.tasks.length === 1 ? "task" : "tasks"}
                  {paper.visual ? " / visual" : ""}
                </span>
                <span style={{ fontSize: 12, color: "var(--accent-cyan)", fontWeight: 600 }}>
                  Implement
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredPapers.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          <p>No papers found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
