import Link from "next/link";
import { problems, difficultyConfig } from "@/data/problems";

export default function HomePage() {
  const stats = {
    totalProblems: problems.length,
    totalSolves: problems.reduce((acc, p) => acc + p.solveCount, 0),
    papers: new Set(problems.map((p) => p.paper)).size,
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
      {/* Hero */}
      <section
        style={{
          textAlign: "center",
          padding: "80px 0 60px",
        }}
        className="animate-fade-in"
      >
        <div
          style={{
            display: "inline-block",
            padding: "6px 16px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            background: "rgba(6, 182, 212, 0.1)",
            color: "var(--accent-cyan)",
            border: "1px solid rgba(6, 182, 212, 0.2)",
            marginBottom: 24,
          }}
        >
          ML Paper Implementations
        </div>
        <h1
          style={{
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: 20,
          }}
        >
          Implement papers,{" "}
          <span className="gradient-text">not just read them</span>
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "var(--text-secondary)",
            maxWidth: 600,
            margin: "0 auto 40px",
            lineHeight: 1.6,
          }}
        >
          Master deep learning by implementing key concepts from landmark papers.
          Micro-tasks with unit tests. Track your progress. Climb the leaderboard.
        </p>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 48,
            flexWrap: "wrap",
          }}
        >
          {[
            { value: stats.totalProblems, label: "Problems" },
            { value: stats.totalSolves.toLocaleString(), label: "Total Solves" },
            { value: stats.papers, label: "Papers Covered" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
                className="gradient-text"
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem Grid */}
      <section style={{ paddingBottom: 80 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>All Problems</h2>
          <div style={{ display: "flex", gap: 8 }}>
            {(["easy", "medium", "hard"] as const).map((d) => (
              <span
                key={d}
                className={`badge-${d}`}
                style={{
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {difficultyConfig[d].label}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 20,
          }}
          className="stagger-children"
        >
          {problems.map((problem, i) => (
            <Link
              key={problem.slug}
              href={`/problems/${problem.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="glass-card" style={{ padding: 24, height: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    #{String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`badge-${problem.difficulty}`}
                    style={{
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    {difficultyConfig[problem.difficulty].label}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    marginBottom: 8,
                    lineHeight: 1.3,
                  }}
                >
                  {problem.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-muted)",
                    marginBottom: 16,
                    lineHeight: 1.5,
                  }}
                >
                  {problem.paper}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: 12,
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {problem.solveCount.toLocaleString()} solves
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--accent-cyan)",
                      fontWeight: 600,
                    }}
                  >
                    Solve →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
