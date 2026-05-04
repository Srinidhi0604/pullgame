export default function AboutPage() {
  const steps = [
    {
      num: "01",
      title: "Pick a Paper Concept",
      description: "Browse our curated collection of problems from landmark ML papers. Each problem isolates a single concept.",
      color: "var(--accent-cyan)",
    },
    {
      num: "02",
      title: "Implement from Scratch",
      description: "Write the implementation using only NumPy. No high-level frameworks. Understand every line of math.",
      color: "var(--accent-purple)",
    },
    {
      num: "03",
      title: "Pass the Tests",
      description: "Your implementation is validated against reference outputs with shape checks and value assertions.",
      color: "var(--accent-green)",
    },
    {
      num: "04",
      title: "Climb the Ranks",
      description: "Earn points based on difficulty, build streaks, collect badges, and compete on the leaderboard.",
      color: "var(--accent-amber)",
    },
  ];

  const techStack = [
    { name: "Next.js 15", desc: "React framework with App Router" },
    { name: "TypeScript", desc: "Type-safe development" },
    { name: "Tailwind CSS", desc: "Utility-first styling" },
    { name: "Supabase", desc: "Auth, database, and storage" },
    { name: "Python", desc: "Problem execution environment" },
    { name: "NumPy", desc: "Scientific computing for ML" },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Header */}
      <div className="animate-fade-in" style={{ textAlign: "center", marginBottom: 60 }}>
        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: 16,
          }}
        >
          About <span className="gradient-text">PullGame</span>
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "var(--text-secondary)",
            maxWidth: 600,
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          PullGame is a practice platform for machine learning engineers who want to
          deeply understand the papers they read — by implementing them from scratch.
        </p>
      </div>

      {/* How it works */}
      <section style={{ marginBottom: 60 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 32, textAlign: "center" }}>
          How It Works
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}
          className="stagger-children"
        >
          {steps.map((step) => (
            <div key={step.num} className="glass-card" style={{ padding: 24 }}>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: step.color,
                  opacity: 0.3,
                  marginBottom: 8,
                  lineHeight: 1,
                }}
              >
                {step.num}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{step.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section
        className="glass-card-static"
        style={{
          padding: 40,
          marginBottom: 60,
          textAlign: "center",
          background: "var(--gradient-card)",
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
          The Philosophy
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "var(--text-secondary)",
            lineHeight: 1.8,
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          Reading a paper gives you intuition. Implementing it gives you understanding.
          PullGame bridges this gap with <strong style={{ color: "var(--accent-cyan)" }}>micro-tasks</strong> that
          isolate key concepts, <strong style={{ color: "var(--accent-purple)" }}>unit tests</strong> that verify
          your implementation, and a <strong style={{ color: "var(--accent-green)" }}>gamified experience</strong> that
          keeps you coming back.
        </p>
      </section>

      {/* Tech Stack */}
      <section style={{ marginBottom: 60 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, textAlign: "center" }}>
          Tech Stack
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: 12,
          }}
        >
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="glass-card"
              style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--gradient-brand)",
                  flexShrink: 0,
                }}
              />
              <div>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{tech.name}</span>
                <span style={{ color: "var(--text-muted)", fontSize: 12, marginLeft: 8 }}>
                  {tech.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Built by */}
      <section style={{ textAlign: "center" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Built By</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7 }}>
          Built with passion by ML engineers who believe the best way to learn is by doing.
        </p>
        <div style={{ marginTop: 20, display: "flex", gap: 12, justifyContent: "center" }}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ textDecoration: "none", fontSize: 13 }}
          >
            GitHub
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ textDecoration: "none", fontSize: 13 }}
          >
            Twitter
          </a>
        </div>
      </section>
    </div>
  );
}
