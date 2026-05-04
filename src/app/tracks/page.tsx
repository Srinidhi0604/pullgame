"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function TracksPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [smoothedProgress, setSmoothedProgress] = useState(0);

  // Smooth out the scroll progress
  useEffect(() => {
    let animationFrameId: number;
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const animate = () => {
      setSmoothedProgress((prev) => {
        const next = lerp(prev, scrollProgress, 0.1);
        return Math.abs(next - scrollProgress) < 0.001 ? scrollProgress : next;
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [scrollProgress]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      
      let progress = scrolled / scrollableDistance;
      progress = Math.max(0, Math.min(1, progress));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tracks = [
    {
      id: "ml",
      title: "Machine Learning",
      x: -300,
      y: 50,
      path: "M 500 500 H 200 V 550",
      len: 350,
      drawStart: 0.1,
      drawEnd: 0.4,
      fadeStart: 0.4,
      fadeEnd: 0.5,
      icon: "∑",
      formula: "lnq P(x_t | x_<t)",
      color: "#a855f7",
    },
    {
      id: "hardware",
      title: "Hardware",
      x: 0,
      y: 280,
      path: "M 500 500 V 780",
      len: 280,
      drawStart: 0.2,
      drawEnd: 0.5,
      fadeStart: 0.5,
      fadeEnd: 0.6,
      icon: "⚡",
      formula: "P = αCFV² + I_leakV",
      color: "#3b82f6",
    },
    {
      id: "biology",
      title: "Bio & Chemistry",
      x: 300,
      y: 50,
      path: "M 500 500 H 800 V 550",
      len: 350,
      drawStart: 0.3,
      drawEnd: 0.6,
      fadeStart: 0.6,
      fadeEnd: 0.7,
      icon: "⌬",
      formula: "ΔG = ΔH - TΔS",
      color: "#10b981",
    },
  ];

  // Title fades out as you start scrolling
  const titleOpacity = Math.max(0, 1 - smoothedProgress * 5);
  const titleOffsetY = smoothedProgress * -50;

  return (
    <div ref={containerRef} style={{ height: "300vh", background: "#000", color: "#fff" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Title Text */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            textAlign: "center",
            opacity: titleOpacity,
            transform: `translateY(${titleOffsetY}px)`,
            zIndex: 20,
          }}
        >
          <h1 style={{ fontSize: 48, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 16 }}>
            Select Your Track
          </h1>
          <p style={{ color: "#9ca3af", fontSize: 18 }}>Scroll to uncover domains.</p>
        </div>

        {/* Central Coordinate System */}
        <div style={{ position: "absolute", left: "50%", top: "45%" }}>
          
          {/* SVG Flowchart Lines */}
          <svg
            style={{
              position: "absolute",
              left: -500,
              top: -500,
              width: 1000,
              height: 1000,
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            {tracks.map((track) => {
              // Calculate draw progress for this line (0 to 1)
              let drawP = (smoothedProgress - track.drawStart) / (track.drawEnd - track.drawStart);
              drawP = Math.max(0, Math.min(1, drawP));
              
              const offset = track.len * (1 - drawP);

              return (
                <path
                  key={`path-${track.id}`}
                  d={track.path}
                  stroke={track.color + "80"}
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={track.len}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}
          </svg>

          {/* Source Document Stack (Center) */}
          <div
            style={{
              position: "absolute",
              width: 140,
              height: 180,
              left: 0,
              top: 0,
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          >
            {/* Back layers */}
            <div style={{ position: "absolute", top: -16, left: 16, right: -16, bottom: 16, background: "#0f0f0f", border: "1px solid #2a2a2a", borderRadius: 12 }}></div>
            <div style={{ position: "absolute", top: -8, left: 8, right: -8, bottom: 8, background: "#151515", border: "1px solid #333", borderRadius: 12 }}></div>
            
            {/* Front layer */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "#1c1c1c", border: "1px solid #444", borderRadius: 12, padding: "24px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ height: 6, background: "#444", borderRadius: 3, width: "70%" }}></div>
              <div style={{ height: 6, background: "#444", borderRadius: 3, width: "100%" }}></div>
              <div style={{ height: 6, background: "#444", borderRadius: 3, width: "90%" }}></div>
              <div style={{ height: 6, background: "#444", borderRadius: 3, width: "100%" }}></div>
              <div style={{ height: 6, background: "#444", borderRadius: 3, width: "85%" }}></div>
              <div style={{ height: 6, background: "#444", borderRadius: 3, width: "95%" }}></div>
              
              <div style={{ marginTop: "auto", display: "flex", justifyContent: "center" }}>
                 <span style={{ fontSize: 20, color: "#888", fontWeight: 700 }}>&lt;/&gt;</span>
              </div>
            </div>
          </div>

          {/* Track Cards at endpoints */}
          {tracks.map((track) => {
            // Calculate fade progress (0 to 1)
            let fadeP = (smoothedProgress - track.fadeStart) / (track.fadeEnd - track.fadeStart);
            fadeP = Math.max(0, Math.min(1, fadeP));
            
            return (
              <div
                key={`card-${track.id}`}
                style={{
                  position: "absolute",
                  left: track.x,
                  top: track.y,
                  transform: `translate(-50%, -50%) translateY(${(1 - fadeP) * 20}px)`,
                  opacity: fadeP,
                  zIndex: 15,
                  pointerEvents: fadeP > 0.5 ? "auto" : "none",
                }}
              >
                <Link href={`/papers?track=${track.id}`} style={{ textDecoration: "none" }}>
                  <div
                    className="track-card"
                    style={{
                      width: 180,
                      height: 240,
                      background: "#151515",
                      border: `1px solid ${track.color}80`,
                      borderRadius: 12,
                      padding: "20px 16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = track.color;
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 10px 30px ${track.color}40`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = `${track.color}80`;
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}
                  >
                    <div style={{ height: 4, background: `${track.color}40`, borderRadius: 2, width: "70%" }}></div>
                    <div style={{ height: 4, background: `${track.color}40`, borderRadius: 2, width: "100%" }}></div>
                    <div style={{ height: 4, background: `${track.color}40`, borderRadius: 2, width: "90%" }}></div>
                    <div style={{ height: 4, background: `${track.color}40`, borderRadius: 2, width: "85%" }}></div>
                    
                    <div style={{ marginTop: "auto" }}>
                      <h3
                        style={{
                          fontSize: 15,
                          color: "#fff",
                          fontWeight: 500,
                          marginBottom: 10,
                        }}
                      >
                        {track.title}
                      </h3>
                      <div style={{ background: "#0a0a0a", border: `1px solid ${track.color}60`, padding: "6px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ color: track.color, fontSize: 10 }}>{track.icon}</span>
                        <span style={{ color: "#aaa", fontSize: 9, fontFamily: "monospace", letterSpacing: "-0.05em" }}>{track.formula}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

