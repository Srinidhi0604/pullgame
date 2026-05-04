"use client";

import { useState, useEffect } from "react";

interface ToastMessage {
  id: number;
  text: string;
  type: "success" | "error" | "info";
}

let toastId = 0;
const listeners: Array<(t: ToastMessage) => void> = [];

export function showToast(text: string, type: "success" | "error" | "info" = "info") {
  const t: ToastMessage = { id: ++toastId, text, type };
  listeners.forEach((fn) => fn(t));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (t: ToastMessage) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 3500);
    };
    listeners.push(handler);
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx >= 0) listeners.splice(idx, 1);
    };
  }, []);

  if (toasts.length === 0) return null;

  const colors = {
    success: { bg: "rgba(16, 185, 129, 0.15)", border: "rgba(16, 185, 129, 0.3)", text: "#10b981" },
    error: { bg: "rgba(239, 68, 68, 0.15)", border: "rgba(239, 68, 68, 0.3)", text: "#ef4444" },
    info: { bg: "rgba(6, 182, 212, 0.15)", border: "rgba(6, 182, 212, 0.3)", text: "#06b6d4" },
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 80,
        right: 24,
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            padding: "14px 20px",
            borderRadius: 12,
            background: colors[t.type].bg,
            border: `1px solid ${colors[t.type].border}`,
            color: colors[t.type].text,
            fontSize: 13,
            fontWeight: 600,
            backdropFilter: "blur(12px)",
            animation: "slideUp 0.3s ease",
            maxWidth: 360,
          }}
        >
          {t.type === "success" ? "✓ " : t.type === "error" ? "✗ " : "ℹ "}
          {t.text}
        </div>
      ))}
    </div>
  );
}
