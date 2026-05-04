"use client";

import { useState } from "react";
import Link from "next/link";
import { mockUsers, currentUser } from "@/data/users";

type FilterType = "all" | "week" | "month";

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<FilterType>("all");

  const sortedUsers = [...mockUsers].sort((a, b) => b.score - a.score);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Header */}
      <div className="animate-fade-in" style={{ marginBottom: 40 }}>
        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: 12,
          }}
        >
          Leader<span className="gradient-text">board</span>
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
          Top implementers ranked by score. Score = Σ(difficulty_weight × problems_solved)
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
        {(
          [
            { key: "all", label: "All Time" },
            { key: "week", label: "This Week" },
            { key: "month", label: "This Month" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={filter === tab.key ? "tab-active" : "tab-inactive"}
            style={{
              padding: "8px 20px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              border: filter === tab.key ? "none" : undefined,
              transition: "all 0.2s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card-static animate-slide-up" style={{ overflow: "hidden" }}>
        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "60px 1fr 140px 100px 100px",
            padding: "16px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--text-muted)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          <span>Rank</span>
          <span>User</span>
          <span style={{ textAlign: "center" }}>Problems Solved</span>
          <span style={{ textAlign: "center" }}>Streak</span>
          <span style={{ textAlign: "right" }}>Score</span>
        </div>

        {/* Rows */}
        {sortedUsers.map((user, index) => {
          const rank = index + 1;
          const isCurrentUser = user.id === currentUser.id;

          return (
            <Link
              key={user.id}
              href={`/profile/${user.username}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                className={isCurrentUser ? "highlight-row" : ""}
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr 140px 100px 100px",
                  padding: "16px 24px",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  transition: "background 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!isCurrentUser) {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "rgba(255,255,255,0.03)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCurrentUser) {
                    (e.currentTarget as HTMLDivElement).style.background = "";
                  }
                }}
              >
                {/* Rank */}
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: rank <= 3 ? 18 : 14,
                    color:
                      rank === 1
                        ? "#fbbf24"
                        : rank === 2
                          ? "#94a3b8"
                          : rank === 3
                            ? "#d97706"
                            : "var(--text-muted)",
                  }}
                >
                  {rank <= 3
                    ? rank === 1
                      ? "🥇"
                      : rank === 2
                        ? "🥈"
                        : "🥉"
                    : `#${rank}`}
                </span>

                {/* User */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: `hsl(${(rank * 47) % 360}, 60%, 40%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "white",
                      flexShrink: 0,
                    }}
                  >
                    {user.username[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      {user.username}
                      {isCurrentUser && (
                        <span
                          style={{
                            fontSize: 10,
                            marginLeft: 8,
                            padding: "2px 8px",
                            borderRadius: 10,
                            background: "rgba(6, 182, 212, 0.15)",
                            color: "var(--accent-cyan)",
                            fontWeight: 600,
                          }}
                        >
                          YOU
                        </span>
                      )}
                    </div>
                    {user.plan === "pro" && (
                      <span
                        style={{
                          fontSize: 10,
                          color: "var(--accent-purple)",
                          fontWeight: 600,
                        }}
                      >
                        PRO
                      </span>
                    )}
                  </div>
                </div>

                {/* Problems Solved */}
                <span
                  style={{
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "var(--text-primary)",
                  }}
                >
                  {user.problemsSolved}
                </span>

                {/* Streak */}
                <span
                  style={{
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: 14,
                    color:
                      user.currentStreak >= 7
                        ? "var(--accent-amber)"
                        : "var(--text-secondary)",
                  }}
                >
                  {user.currentStreak > 0
                    ? `🔥 ${user.currentStreak}d`
                    : "—"}
                </span>

                {/* Score */}
                <span
                  style={{
                    textAlign: "right",
                    fontWeight: 800,
                    fontSize: 16,
                  }}
                  className="gradient-text"
                >
                  {user.score}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Score explanation */}
      <div
        className="glass-card-static"
        style={{
          padding: 20,
          marginTop: 24,
          display: "flex",
          gap: 24,
          justifyContent: "center",
          flexWrap: "wrap",
          fontSize: 13,
          color: "var(--text-muted)",
        }}
      >
        <span>
          <span className="badge-easy" style={{ padding: "2px 8px", borderRadius: 10, fontSize: 11, marginRight: 6 }}>
            Easy
          </span>
          ×1 point
        </span>
        <span>
          <span className="badge-medium" style={{ padding: "2px 8px", borderRadius: 10, fontSize: 11, marginRight: 6 }}>
            Medium
          </span>
          ×2 points
        </span>
        <span>
          <span className="badge-hard" style={{ padding: "2px 8px", borderRadius: 10, fontSize: 11, marginRight: 6 }}>
            Hard
          </span>
          ×3 points
        </span>
      </div>
    </div>
  );
}
