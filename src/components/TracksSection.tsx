"use client";

import Link from "next/link";

export default function TracksSection() {
  const tracks = [
    {
      title: "Machine Learning",
      description: "Dive into architectures, algorithms, and deep learning models. Implement core papers from scratch.",
      link: "/papers?track=ml"
    },
    {
      title: "Hardware",
      subtitle: "(Electrical/Electronics)",
      description: "Explore circuit design, embedded systems, and VLSI. Understand the physical layer of computation.",
      link: "/papers?track=hardware"
    },
    {
      title: "Biology",
      subtitle: "(Chemistry)",
      description: "Unravel computational biology, bioinformatics, and molecular modeling through code.",
      link: "/papers?track=biology"
    }
  ];

  return (
    <section style={{ padding: "120px 24px", background: "#050505", borderTop: "1px solid #111", borderBottom: "1px solid #111", textAlign: "center" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 600, color: "white", marginBottom: 16, letterSpacing: "-0.02em" }}>
          Explore by <span style={{ color: "#a855f7" }}>Track</span>
        </h2>
        <p style={{ color: "#9ca3af", fontSize: 18, maxWidth: 600, margin: "0 auto 64px", lineHeight: 1.6 }}>
          Choose your domain. Master the fundamental papers and concepts that define the cutting edge of these fields.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, textAlign: "left" }}>
          {tracks.map((track, i) => (
            <Link href={track.link} key={i} style={{ textDecoration: "none" }}>
              <div style={{ 
                background: "#0a0a0a", 
                border: "1px solid #222", 
                borderRadius: 16, 
                padding: 32, 
                height: "100%",
                transition: "all 0.2s ease-out",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "white";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 10px 40px -10px rgba(255,255,255,0.1)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#222";
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
              >
                <h3 style={{ fontSize: 24, fontWeight: 600, color: "white", marginBottom: 4 }}>{track.title}</h3>
                {track.subtitle && (
                  <div style={{ fontSize: 14, color: "#9ca3af", marginBottom: 16, fontWeight: 500 }}>{track.subtitle}</div>
                )}
                <p style={{ color: "#9ca3af", fontSize: 15, lineHeight: 1.6, flex: 1, marginTop: track.subtitle ? 0 : 16 }}>
                  {track.description}
                </p>
                <div style={{ marginTop: 32, display: "flex", alignItems: "center", color: "white", fontSize: 14, fontWeight: 500 }}>
                  Explore Track <span style={{ marginLeft: 8, color: "white" }}>&rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
