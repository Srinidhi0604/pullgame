import { papers, difficultyConfig, tagColors } from "@/data/papers";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return papers.map((p) => ({ slug: p.slug }));
}

export default async function PaperDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const paper = papers.find((p) => p.slug === slug);
  if (!paper) notFound();

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Back link */}
      <Link
        href="/"
        style={{
          color: "var(--text-muted)",
          fontSize: 13,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 40,
          transition: "color 0.2s ease",
        }}
      >
        ← Back to Papers
      </Link>

      {/* Paper Header */}
      <div className="animate-fade-in" style={{ marginBottom: 40 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 38px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              flex: 1,
            }}
          >
            {paper.title}
          </h1>

          {/* Read Original button */}
          <a
            href={paper.paperUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "8px 18px",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
              flexShrink: 0,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              color: "var(--text-secondary)",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            📄 Read Original
          </a>
        </div>

        {/* Year + Authors as pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <span className="year-badge">{paper.year}</span>
          {paper.authors.map((author) => (
            <span
              key={author}
              style={{
                padding: "3px 10px",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 500,
                background: "rgba(255,255,255,0.06)",
                color: "var(--text-secondary)",
              }}
            >
              {author}
            </span>
          ))}
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: "var(--text-secondary)",
          }}
        >
          {paper.description}
        </p>
      </div>

      {/* Implementation Track */}
      <div className="animate-slide-up">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Implementation Track</h2>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              background: "rgba(255,255,255,0.08)",
              color: "var(--text-secondary)",
            }}
          >
            {paper.tasks.length} {paper.tasks.length === 1 ? "Task" : "Tasks"}
          </span>
        </div>

        {/* Task List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {paper.tasks.map((task, i) => {
            const dc = difficultyConfig[task.difficulty];
            return (
              <Link
                key={task.slug}
                href={`/papers/${paper.slug}/problems/${task.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className={`task-card task-card-${task.difficulty}`}>
                  {/* Task number */}
                  <div style={{ flexShrink: 0, textAlign: "center", minWidth: 48 }}>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 2,
                      }}
                    >
                      Task
                    </div>
                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: 800,
                        color: "var(--text-muted)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Task info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        marginBottom: 4,
                      }}
                    >
                      {task.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--text-muted)",
                        lineHeight: 1.5,
                      }}
                    >
                      {task.description.split("\n")[0].replace(/^#\s*/, "").substring(0, 80)}...
                    </p>
                  </div>

                  {/* Badges */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        background: "rgba(255,255,255,0.06)",
                        color: "var(--text-muted)",
                      }}
                    >
                      {task.category}
                    </span>
                    <span
                      className={`badge-${task.difficulty}`}
                      style={{
                        padding: "3px 10px",
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {dc.label}
                    </span>
                  </div>

                  {/* Completion circle */}
                  <div className="completion-circle" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
