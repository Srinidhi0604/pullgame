import { allFundTopics, difficultyConfig } from "@/data/fundamentals";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return allFundTopics.map((t) => ({ subject: t.subject, slug: t.slug }));
}

export default async function FundTopicPage({
  params,
}: {
  params: Promise<{ subject: string; slug: string }>;
}) {
  const { subject, slug } = await params;
  const topic = allFundTopics.find((t) => t.subject === subject && t.slug === slug);
  if (!topic) notFound();

  const subjectLabel: Record<string, string> = {
    ml150: "ML 150",
    numpy: "NumPy",
    pandas: "Pandas",
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Back */}
      <Link
        href="/fundamentals"
        style={{ color: "var(--text-muted)", fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 40 }}
      >
        ← Back to Fundamentals
      </Link>

      {/* Header */}
      <div className="animate-fade-in" style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: "clamp(26px, 5vw, 36px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 14 }}>
          {subjectLabel[topic.subject] ?? topic.subject}: {topic.title}
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
          <span className="year-badge">{topic.year}</span>
          {topic.authors.map((a) => (
            <span key={a} style={{ padding: "3px 10px", borderRadius: 4, fontSize: 12, fontWeight: 500, background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}>
              {a}
            </span>
          ))}
        </div>

        <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)" }}>{topic.description}</p>
      </div>

      {/* Implementation Track */}
      <div className="animate-slide-up">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Implementation Track</h2>
          <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: "rgba(255,255,255,0.08)", color: "var(--text-secondary)" }}>
            {topic.tasks.length} {topic.tasks.length === 1 ? "Task" : "Tasks"}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {topic.tasks.map((task, i) => {
            const dc = difficultyConfig[task.difficulty];
            return (
              <Link
                key={task.slug}
                href={`/fundamentals/${subject}/${slug}/problems/${task.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className={`task-card task-card-${task.difficulty}`}>
                  {/* Number */}
                  <div style={{ flexShrink: 0, textAlign: "center", minWidth: 48 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>
                      Task
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-muted)", letterSpacing: "-0.02em" }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{task.title}</h3>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                      {task.shortDescription}
                    </p>
                  </div>

                  {/* Badges */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <span style={{ padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>
                      {task.category}
                    </span>
                    <span className={`badge-${task.difficulty}`} style={{ padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                      {dc.label}
                    </span>
                  </div>

                  {/* Circle */}
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
