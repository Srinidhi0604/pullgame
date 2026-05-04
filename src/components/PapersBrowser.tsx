"use client";

import Link from "next/link";
import { useState } from "react";
import { papers, type PaperTrack } from "@/data/papers";

type ActiveTrack = string;

interface PapersBrowserProps {
  initialTrack: string;
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

const trackLabels: Record<string, string> = {
  all: "All Tracks",
  ml: "Machine Learning",
  biochem: "Bio & Chemistry",
  hardware: "Hardware & EE",
};

const trackOrder = ["ml", "biochem", "hardware"];

const getTagColor = (tag: string) => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return tagColors[Math.abs(hash) % tagColors.length];
};

import { useRouter } from "next/navigation";

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

export function PapersBrowser({ initialTrack }: PapersBrowserProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeTrack, setActiveTrack] = useState<string>(initialTrack === "all" ? "all" : initialTrack);
  const [isUploading, setIsUploading] = useState(false);

  const getConsolidatedTrack = (paperTrack: PaperTrack | undefined): string => {
    const t = paperTrack ?? "ml";
    if (t === "biology" || t === "chemistry") return "biochem";
    if (t === "electrical" || t === "electronics") return "hardware";
    return t;
  };

  const trackFilteredPapers = papers.filter((paper) => 
    activeTrack === "all" || getConsolidatedTrack(paper.track) === activeTrack
  );
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

  const sections =
    activeTrack === "all"
      ? trackOrder
          .map((track) => ({
            track,
            title: trackLabels[track],
            papers: filteredPapers.filter((paper) => getConsolidatedTrack(paper.track) === track),
          }))
          .filter((section) => section.papers.length > 0)
      : [{ track: activeTrack, title: trackLabels[activeTrack], papers: filteredPapers }];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      // Simulate paper processing delay
      setTimeout(() => {
        router.push("/papers/batch-normalization");
      }, 1500);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 100px" }} className="animate-fade-in">
      <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Papers</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 16 }}>
            Select a paper to start implementing.
          </p>
        </div>
        
        <div>
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              background: "var(--accent-cyan)",
              color: "#000",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: isUploading ? "not-allowed" : "pointer",
              opacity: isUploading ? 0.7 : 1,
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!isUploading) (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              if (!isUploading) (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
                Processing paper...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Upload research paper
              </>
            )}
            <input type="file" accept=".pdf" style={{ display: "none" }} onChange={handleUpload} disabled={isUploading} />
          </label>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
        {Object.keys(trackLabels).map((track) => (
          <button
            key={track}
            onClick={() => {
              setActiveTrack(track);
              setActiveTag(null);
            }}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              background: activeTrack === track ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.03)",
              color: activeTrack === track ? "var(--text-primary)" : "var(--text-secondary)",
              border: activeTrack === track ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.07)",
              transition: "all 0.2s"
            }}
          >
            {trackLabels[track]}
            <span style={{ color: "var(--text-muted)", marginLeft: 6, fontWeight: 500 }}>
              {track === "all" ? papers.length : papers.filter((paper) => getConsolidatedTrack(paper.track) === track).length}
            </span>
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
        {(() => {
          const MAX_TAGS = 10;
          const [isExpanded, setIsExpanded] = useState(false);
          
          // Count occurrences of each tag to show most frequent ones
          const tagCounts = trackFilteredPapers.flatMap(p => p.tags).reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          const sortedTags = allTags.sort((a, b) => (tagCounts[b] || 0) - (tagCounts[a] || 0));
          const visibleTags = isExpanded ? sortedTags : sortedTags.slice(0, MAX_TAGS);
          const hasMore = sortedTags.length > MAX_TAGS;

          return (
            <>
              {visibleTags.map((tag) => {
                const color = getTagColor(tag);
                const isSelected = activeTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(isSelected ? null : tag)}
                    style={{
                      padding: "4px 12px",
                      borderRadius: 16,
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                      background: isSelected ? `${color}30` : "transparent",
                      color: isSelected ? color : "var(--text-secondary)",
                      border: `1px solid ${isSelected ? color : "transparent"}`,
                      transition: "all 0.2s",
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
              {hasMore && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 16,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: "transparent",
                    color: "var(--accent-cyan)",
                    border: "1px solid rgba(0, 188, 212, 0.2)",
                    marginLeft: 4
                  }}
                >
                  {isExpanded ? "Show Less" : `+${sortedTags.length - MAX_TAGS} More`}
                </button>
              )}
            </>
          );
        })()}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: activeTrack === "all" ? 52 : 0 }}>
        {sections.map((section) => (
          <section key={section.track}>
            {activeTrack === "all" && (
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800 }}>{section.title}</h2>
                  <p style={{ marginTop: 4, color: "var(--text-muted)", fontSize: 13 }}>
                    {section.papers.length} papers with runnable implementation tracks
                  </p>
                </div>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 24 }} className="stagger-children">
              {section.papers.map((paper) => (
                <PaperCard key={paper.slug} paper={paper} />
              ))}
            </div>
          </section>
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

function PaperCard({ paper }: { paper: (typeof papers)[number] }) {
  return (
    <Link href={`/papers/${paper.slug}`} style={{ textDecoration: "none" }}>
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
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {paper.sourceUrl && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  window.open(paper.sourceUrl, "_blank", "noopener,noreferrer");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "4px 8px",
                  borderRadius: 6,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                Original PDF
              </button>
            )}
            <span style={{ fontSize: 12, color: "var(--accent-cyan)", fontWeight: 600 }}>
              Implement
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
