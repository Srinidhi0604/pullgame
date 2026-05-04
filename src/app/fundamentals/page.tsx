"use client";

import { useState, useEffect } from "react";
import FundamentalsModal, { allTopics, type ModalTopic } from "@/components/FundamentalsModal";

// ─── Data ────────────────────────────────────────────────────────────────────

const numpySections = [
  { id: 1, topicId: "numpy-array-basics",                   title: "Array Basics",                    rows: 8 },
  { id: 2, topicId: "numpy-broadcasting",                   title: "Broadcasting",                    rows: 6 },
  { id: 3, topicId: "numpy-advanced-indexing",              title: "Advanced Indexing",               rows: 7 },
  { id: 4, topicId: "numpy-array-manipulation",             title: "Array Manipulation",              rows: 7 },
  { id: 5, topicId: "numpy-mathematical-operations",        title: "Mathematical Operations",         rows: 7 },
  { id: 6, topicId: "numpy-advanced-broadcasting-einsum",   title: "Advanced Broadcasting & Einsum",  rows: 7 },
  { id: 7, topicId: "numpy-memory-performance",             title: "Memory & Performance",            rows: 5 },
  { id: 8, topicId: "numpy-real-world-applications",        title: "Real-World Applications",         rows: 3 },
];

const pandasSections = [
  { id: 1, topicId: "pandas-dataframe-basics",         title: "DataFrame Basics",          rows: 8 },
  { id: 2, topicId: "pandas-indexing-selection",       title: "Indexing & Selection",      rows: 6 },
  { id: 3, topicId: "pandas-data-cleaning",            title: "Data Cleaning",             rows: 7 },
  { id: 4, topicId: "pandas-groupby-operations",       title: "GroupBy Operations",        rows: 7 },
  { id: 5, topicId: "pandas-merging-joining",          title: "Merging & Joining",         rows: 7 },
  { id: 6, topicId: "pandas-time-series",              title: "Time Series",               rows: 7 },
  { id: 7, topicId: "pandas-performance-optimization", title: "Performance Optimization",  rows: 5 },
  { id: 8, topicId: "pandas-real-world-applications",  title: "Real-World Applications",   rows: 3 },
];

const ml150Nodes = [
  { id: "prerequisites-tensors",      label: "Prerequisites & Tensors",    category: "BASICS",     icon: "⊞", x: 50, y: 8  },
  { id: "neural-network-fundamentals",label: "Neural Network Fundamentals",category: "BASICS",     icon: "◎", x: 50, y: 26 },
  { id: "cnns",                        label: "CNNs",                       category: "VISION",     icon: "▦", x: 22, y: 47 },
  { id: "rnns",                        label: "RNNs",                       category: "SEQUENCE",   icon: "↺", x: 78, y: 47 },
  { id: "generative-models",           label: "Generative Models",          category: "GENERATIVE", icon: "✦", x: 22, y: 68 },
  { id: "transformers-attention",      label: "Transformers & Attention",   category: "NLP",        icon: ">_",x: 78, y: 68 },
  { id: "advanced-topics",             label: "Advanced Topics",            category: "ADVANCED",   icon: "↯", x: 50, y: 89 },
];

const ml150Edges = [
  ["prerequisites-tensors", "neural-network-fundamentals"],
  ["neural-network-fundamentals", "cnns"],
  ["neural-network-fundamentals", "rnns"],
  ["cnns", "generative-models"],
  ["rnns", "transformers-attention"],
  ["generative-models", "advanced-topics"],
  ["transformers-attention", "advanced-topics"],
];

const CAT_COLOR: Record<string, string> = {
  BASICS: "#4a9eff", VISION: "#a855f7", SEQUENCE: "#22c55e",
  GENERATIVE: "#f97316", NLP: "#eab308", ADVANCED: "#ef4444",
};

const topicById = Object.fromEntries(allTopics.map((t) => [t.id, t]));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDescription(topicId: string) {
  return topicById[topicId]?.description ?? "";
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({
  section,
  onOpen,
}: {
  section: { id: number; topicId: string; title: string; rows: number };
  onOpen: (t: ModalTopic) => void;
}) {
  const [hov, setHov] = useState(false);
  const topic = topicById[section.topicId];

  return (
    <div
      onClick={() => topic && onOpen(topic)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#0d0d0d" : "#050505",
        border: `1px solid ${hov ? "#555" : "#222"}`,
        borderRadius: 16, padding: 32,
        display: "flex", flexDirection: "column",
        transition: "all 0.2s", cursor: "pointer",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? "0 8px 32px rgba(255,255,255,0.04)" : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#111", border: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white" }}>
          {section.id}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 12, background: "#111", border: "1px solid #333", color: "#aaa" }}>
          {section.rows} rows
        </div>
        <div style={{ marginLeft: "auto", color: "#444" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
        </div>
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 600, color: "white", marginBottom: 10 }}>{section.title}</h3>
      <p style={{ fontSize: 14, color: "#9ca3af", lineHeight: 1.65, flex: 1 }}>{getDescription(section.topicId)}</p>
      <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#555", fontWeight: 500 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
        Tutorial included
      </div>
    </div>
  );
}

// ─── ML150 Roadmap ────────────────────────────────────────────────────────────

function ML150Roadmap({ onOpen }: { onOpen: (t: ModalTopic) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const nodeById = Object.fromEntries(ml150Nodes.map((n) => [n.id, n]));
  const W = 900, H = 620, NW = 164, NH = 72;
  const px = (p: number) => (p / 100) * W;
  const py = (p: number) => (p / 100) * H;

  return (
    <div>
      <p style={{ fontSize: 15, color: "#9ca3af", marginBottom: 36 }}>
        Follow the path to master Machine Learning <strong style={{ color: "white" }}>from scratch</strong>. Click any node to see topics.
      </p>
      <div style={{ background: "#030303", border: "1px solid #1a1a1a", borderRadius: 20, padding: "16px 8px", overflowX: "auto" }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W, display: "block", margin: "0 auto" }}>
          <defs>
            <pattern id="gdots" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.7" fill="#1c1c1c"/>
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#gdots)"/>
          {/* Edges */}
          {ml150Edges.map(([f, t]) => {
            const a = nodeById[f], b = nodeById[t];
            if (!a || !b) return null;
            const ax = px(a.x), ay = py(a.y) + NH / 2;
            const bx = px(b.x), by = py(b.y) - NH / 2;
            const my = (ay + by) / 2;
            const hot = hovered === f || hovered === t;
            return (
              <path key={`${f}-${t}`}
                d={`M ${ax} ${ay} C ${ax} ${my}, ${bx} ${my}, ${bx} ${by}`}
                fill="none" stroke={hot ? "#444" : "#222"}
                strokeWidth={hot ? 2 : 1.5} style={{ transition: "all 0.2s" }}
              />
            );
          })}
          {/* Nodes */}
          {ml150Nodes.map((node) => {
            const cx = px(node.x), cy = py(node.y);
            const x = cx - NW / 2, y = cy - NH / 2;
            const isHov = hovered === node.id;
            const col = CAT_COLOR[node.category] || "#fff";
            const words = node.label.split(" ");
            const half = Math.ceil(words.length / 2);
            const line1 = words.slice(0, half).join(" ");
            const line2 = words.slice(half).join(" ");
            return (
              <g key={node.id} style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => { const t = topicById[node.id]; if (t) onOpen(t); }}
              >
                <rect x={x} y={y} width={NW} height={NH} rx={10}
                  fill={isHov ? "#121212" : "#090909"}
                  stroke={isHov ? col : "#2e2e2e"}
                  strokeWidth={isHov ? 1.5 : 1}
                  style={{ transition: "all 0.2s", filter: isHov ? `drop-shadow(0 0 8px ${col}44)` : "none" }}
                />
                <text x={cx} y={y + 17} textAnchor="middle" fontSize={8.5} fontWeight={700}
                  fill={col} fontFamily="Inter,system-ui" letterSpacing={2}>{node.category}</text>
                <text x={cx} y={y + 30} textAnchor="middle" fontSize={10} fill="#444" fontFamily="monospace">{node.icon}</text>
                <text x={cx} y={y + 46} textAnchor="middle" fontSize={12} fontWeight={700}
                  fill="white" fontFamily="Inter,system-ui">{line1}</text>
                {line2 && (
                  <text x={cx} y={y + 61} textAnchor="middle" fontSize={12} fontWeight={700}
                    fill="white" fontFamily="Inter,system-ui">{line2}</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Cards list */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#ddd" }}>All Topics</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 14 }}>
          {ml150Nodes.map((node) => {
            const col = CAT_COLOR[node.category] || "#fff";
            const topic = topicById[node.id];
            return (
              <div key={node.id} onClick={() => topic && onOpen(topic)}
                style={{ background: "#050505", border: "1px solid #1e1e1e", borderRadius: 12, padding: "18px 22px", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = col + "77"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e1e1e"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: col, marginBottom: 6 }}>{node.category}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 6 }}>{node.label}</div>
                <div style={{ fontSize: 12.5, color: "#666", lineHeight: 1.5 }}>{getDescription(node.id)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Subject Grid ─────────────────────────────────────────────────────────────

function SubjectGrid({
  title, subtitle,
  sections,
  onOpen,
}: {
  title: string; subtitle: string;
  sections: typeof numpySections;
  onOpen: (t: ModalTopic) => void;
}) {
  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: "clamp(40px,6vw,64px)", fontWeight: 800, marginBottom: 14, letterSpacing: "-0.03em" }}>{title}</h1>
        <p style={{ fontSize: 16, color: "#9ca3af" }}>{subtitle}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 22 }}>
        {sections.map((s) => <SectionCard key={s.id} section={s} onOpen={onOpen} />)}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS = ["ML150", "Numpy", "Pandas"] as const;
type Tab = (typeof TABS)[number];

export default function FundamentalsPage() {
  const [activeTab, setActiveTab] = useState<Tab | null>(null);
  const [mounted, setMounted] = useState(false);
  const [modal, setModal] = useState<ModalTopic | null>(null);

  useEffect(() => { setActiveTab("ML150"); setMounted(true); }, []);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 120px", color: "white" }}>
      {/* Modal */}
      {modal && <FundamentalsModal topic={modal} onClose={() => setModal(null)} />}

      {/* Tab Switcher */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 60 }}>
        <div style={{ display: "flex", background: "#080808", borderRadius: 30, padding: 4, border: "1px solid #1e1e1e", gap: 2 }}>
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 40px", borderRadius: 26,
                background: activeTab === tab ? "rgba(255,255,255,0.09)" : "transparent",
                color: activeTab === tab ? "white" : "#555",
                border: activeTab === tab ? "1px solid #333" : "1px solid transparent",
                fontSize: 14, fontWeight: 600, cursor: "pointer",
                transition: "all 0.2s ease", letterSpacing: 0.3,
              }}
            >{tab}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      {!mounted ? (
        <div style={{ height: 400 }} />
      ) : (
        <>
          {activeTab === "ML150" && (
            <div>
              <h1 style={{ fontSize: "clamp(40px,6vw,64px)", fontWeight: 800, marginBottom: 16, letterSpacing: "-0.03em" }}>ML150</h1>
              <ML150Roadmap onOpen={setModal} />
            </div>
          )}
          {activeTab === "Numpy" && (
            <SubjectGrid
              title="Numpy"
              subtitle="8 progressive sections with tutorials and practice problems — click a section to start learning."
              sections={numpySections} onOpen={setModal}
            />
          )}
          {activeTab === "Pandas" && (
            <SubjectGrid
              title="Pandas"
              subtitle="8 progressive sections with tutorials and practice problems — click a section to start learning."
              sections={pandasSections} onOpen={setModal}
            />
          )}
        </>
      )}
    </div>
  );
}
