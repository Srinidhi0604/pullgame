"use client";

import { useState } from "react";
import Link from "next/link";

// Mock data for the fundamentals topics
const topicsData = {
  numpy: {
    title: "Numpy",
    subtitle: "8 progressive sections with tutorials and practice problems — click a section to start learning.",
    sections: [
      {
        id: 1,
        title: "Array Basics",
        rows: 8,
        description: "Master the fundamentals of NumPy arrays: creation, indexing, operations, and basic manipulations.",
        tutorial: true,
      },
      {
        id: 2,
        title: "Broadcasting",
        rows: 6,
        description: "Learn NumPy's powerful broadcasting mechanism for operations on arrays of different shapes.",
        tutorial: true,
      },
      {
        id: 3,
        title: "Advanced Indexing",
        rows: 7,
        description: "Advanced selection patterns with boolean masks, fancy indexing, and conditional operations.",
        tutorial: true,
      },
      {
        id: 4,
        title: "Array Manipulation",
        rows: 7,
        description: "Split, combine, pad, sort, and transform arrays for data preprocessing.",
        tutorial: true,
      },
      {
        id: 5,
        title: "Mathematical Operations",
        rows: 7,
        description: "Linear algebra operations, matrix multiplication, and mathematical functions.",
        tutorial: true,
      },
      {
        id: 6,
        title: "Advanced Broadcasting & Einsum",
        rows: 7,
        description: "Master Einstein summation notation and complex tensor operations.",
        tutorial: true,
      }
    ]
  }
};

export default function FundamentalsPage() {
  const [activeTab, setActiveTab] = useState("Numpy");

  const currentTopic = topicsData.numpy; // Hardcoded to numpy for now based on the mockup

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 100px", color: "white" }}>
      
      {/* Top Tabs */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 60 }}>
        <div style={{ 
          display: "flex", 
          background: "#0a0a0a", 
          borderRadius: 30, 
          padding: 4, 
          border: "1px solid #222" 
        }}>
          {["ML150", "Numpy", "Pandas"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 40px",
                borderRadius: 26,
                background: activeTab === tab ? "rgba(255,255,255,0.1)" : "transparent",
                color: activeTab === tab ? "white" : "#9ca3af",
                border: "none",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 800, marginBottom: 16, letterSpacing: "-0.03em" }}>
          {currentTopic.title}
        </h1>
        <p style={{ fontSize: 18, color: "#9ca3af" }}>
          {currentTopic.subtitle}
        </p>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 24, marginBottom: 80 }}>
        {currentTopic.sections.map((section) => (
          <Link href={`/fundamentals/${section.title.toLowerCase().replace(/ /g, "-")}`} key={section.id} style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "#050505",
                border: "1px solid #222",
                borderRadius: 16,
                padding: 32,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "white";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#222";
                e.currentTarget.style.transform = "none";
              }}
            >
              {/* Card Header badges */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{ 
                  width: 32, height: 32, borderRadius: "50%", background: "#111", border: "1px solid #333", 
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white" 
                }}>
                  {section.id}
                </div>
                <div style={{ 
                  fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 12, 
                  background: "#111", border: "1px solid #333", color: "white" 
                }}>
                  {section.rows} rows
                </div>
                <div style={{ marginLeft: "auto", color: "#666" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </div>
              </div>

              {/* Card Content */}
              <h3 style={{ fontSize: 20, fontWeight: 600, color: "white", marginBottom: 12 }}>
                {section.title}
              </h3>
              <p style={{ fontSize: 14, color: "#9ca3af", lineHeight: 1.6, flex: 1 }}>
                {section.description}
              </p>

              {/* Card Footer */}
              {section.tutorial && (
                <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#666", fontWeight: 500 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                  Tutorial included
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Conceptual Flowcharts Section */}
      <div style={{ paddingTop: 40, borderTop: "1px solid #222" }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>Concept Flowcharts</h2>
        <p style={{ fontSize: 16, color: "#9ca3af", marginBottom: 40 }}>
          Visual architectures and mental models for core ML components.
        </p>

        {/* Basic Forward Pass Flowchart */}
        <div style={{ 
          background: "#050505", 
          border: "1px solid #222", 
          borderRadius: 16, 
          padding: "60px 40px",
          display: "flex",
          justifyContent: "center",
          overflowX: "auto"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 32, minWidth: 800 }}>
            
            {/* Input Node */}
            <div style={{ 
              width: 140, padding: 20, background: "#0a0a0a", border: "1px solid #444", 
              borderRadius: 8, textAlign: "center", zIndex: 2 
            }}>
              <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>[batch_size, seq_len]</div>
              <div style={{ fontWeight: 600 }}>Input Tensor</div>
            </div>

            {/* Edge */}
            <div style={{ width: 60, height: 2, background: "#333", position: "relative" }}>
              <div style={{ position: "absolute", right: -4, top: -4, width: 10, height: 10, borderTop: "2px solid #333", borderRight: "2px solid #333", transform: "rotate(45deg)" }}></div>
            </div>

            {/* Embedding Node */}
            <div style={{ 
              width: 160, padding: 20, background: "#111", border: "1px solid #666", 
              borderRadius: 8, textAlign: "center", zIndex: 2 
            }}>
              <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>nn.Embedding</div>
              <div style={{ fontWeight: 600 }}>Token Embedding</div>
            </div>

            {/* Edge */}
            <div style={{ width: 60, height: 2, background: "#333", position: "relative" }}>
              <div style={{ position: "absolute", right: -4, top: -4, width: 10, height: 10, borderTop: "2px solid #333", borderRight: "2px solid #333", transform: "rotate(45deg)" }}></div>
            </div>

            {/* Transformer Block Node */}
            <div style={{ 
              width: 180, padding: 20, background: "#1a1a1a", border: "1px dashed #888", 
              borderRadius: 8, textAlign: "center", zIndex: 2 
            }}>
              <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>Nx Layers</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Transformer Block</div>
              <div style={{ fontSize: 11, color: "#666" }}>Self-Attention &rarr; MLP</div>
            </div>

            {/* Edge */}
            <div style={{ width: 60, height: 2, background: "#333", position: "relative" }}>
              <div style={{ position: "absolute", right: -4, top: -4, width: 10, height: 10, borderTop: "2px solid #333", borderRight: "2px solid #333", transform: "rotate(45deg)" }}></div>
            </div>

            {/* Output Node */}
            <div style={{ 
              width: 140, padding: 20, background: "#0a0a0a", border: "1px solid #444", 
              borderRadius: 8, textAlign: "center", zIndex: 2 
            }}>
              <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>[batch_size, vocab]</div>
              <div style={{ fontWeight: 600 }}>Logits</div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
