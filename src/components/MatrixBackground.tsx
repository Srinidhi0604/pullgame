"use client";

import { useEffect, useRef } from "react";

export default function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = canvas.parentElement?.offsetHeight || 500;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        width = canvas.width = parent.offsetWidth;
        height = canvas.height = parent.offsetHeight;
      }
    };
    
    // Initial resize after a short delay to ensure parent is rendered
    setTimeout(resize, 0);
    window.addEventListener("resize", resize);

    const cols = Math.floor(width / 20) + 1;
    const ypos = Array(cols).fill(0).map(() => Math.random() * height); // Randomize initial y positions

    const matrix = () => {
      // Fade effect to create trails
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, width, height);

      // Dark Matrix green
      ctx.fillStyle = "#004400";
      ctx.font = "14pt monospace";

      ypos.forEach((y, ind) => {
        // The user asked for "decimals" (0-9)
        const text = Math.floor(Math.random() * 10).toString();
        const x = ind * 20;
        
        // Randomly make some characters brighter green
        ctx.fillStyle = Math.random() > 0.9 ? "#00ff00" : "#008800";
        
        ctx.fillText(text, x, y);
        
        // Reset to top randomly to create staggered effect
        if (y > height && Math.random() > 0.975) {
          ypos[ind] = 0;
        } else {
          ypos[ind] = y + 20;
        }
      });
    };

    const interval = setInterval(matrix, 60);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: "absolute", 
        top: 0, 
        left: 0, 
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.6 // Blend with the dark background
      }} 
    />
  );
}
