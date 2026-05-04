import { problems, difficultyConfig } from "@/data/problems";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SolveSection } from "@/components/SolveSection";

export function generateStaticParams() {
  return problems.map((p) => ({ slug: p.slug }));
}

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const problem = problems.find((p) => p.slug === slug);
  if (!problem) notFound();

  const dc = difficultyConfig[problem.difficulty];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px" }}>
      <Link
        href="/"
        style={{
          color: "var(--text-muted)",
          fontSize: 13,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 32,
        }}
      >
        ← Back to Problems
      </Link>

      {/* Header */}
      <div className="animate-fade-in" style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span
            className={`badge-${problem.difficulty}`}
            style={{ padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}
          >
            {dc.label}
          </span>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {problem.solveCount.toLocaleString()} solves
          </span>
        </div>
        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: 8,
          }}
        >
          {problem.title}
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>{problem.paper}</p>
      </div>

      {/* Description */}
      <div
        className="glass-card-static animate-slide-up"
        style={{ padding: 32, marginBottom: 32 }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "var(--accent-cyan)" }}>
          Description
        </h2>
        <div
          style={{
            fontSize: 14,
            lineHeight: 1.8,
            color: "var(--text-secondary)",
            whiteSpace: "pre-wrap",
          }}
        >
          {problem.description}
        </div>
      </div>

      {/* Skeleton Code */}
      <div
        className="glass-card-static animate-slide-up"
        style={{ padding: 32, marginBottom: 32 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--accent-purple)" }}>
            Skeleton Code
          </h2>
          <span
            style={{
              fontSize: 11,
              padding: "4px 10px",
              borderRadius: 6,
              background: "rgba(168, 85, 247, 0.15)",
              color: "var(--accent-purple)",
              fontWeight: 600,
            }}
          >
            Python
          </span>
        </div>
        <pre className="code-block">
          <code>{problem.skeleton}</code>
        </pre>
      </div>

      {/* Tests */}
      <div
        className="glass-card-static animate-slide-up"
        style={{ padding: 32, marginBottom: 40 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--accent-green)" }}>
            Test Suite
          </h2>
          <span
            style={{
              fontSize: 11,
              padding: "4px 10px",
              borderRadius: 6,
              background: "rgba(16, 185, 129, 0.15)",
              color: "var(--accent-green)",
              fontWeight: 600,
            }}
          >
            Unit Tests
          </span>
        </div>
        <pre className="code-block">
          <code>{problem.tests}</code>
        </pre>
      </div>

      {/* Solve Section */}
      <SolveSection skeleton={problem.skeleton} tests={problem.tests} />
    </div>
  );
}
