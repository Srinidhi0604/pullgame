"use client";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Everything you need to get started with basic paper implementations.",
      features: [
        "Access to 5 free papers/month",
        "Basic execution environment",
        "Community support",
      ],
      buttonText: "Start for free",
      isPopular: false,
    },
    {
      name: "Plus",
      price: "$10",
      period: "/month",
      description: "For active learners who want to implement more advanced concepts.",
      features: [
        "Access to 50 papers/month",
        "Advanced execution environment",
        "Priority community support",
        "Access to basic visualization tools",
      ],
      buttonText: "Subscribe to Plus",
      isPopular: true,
    },
    {
      name: "Pro",
      price: "$20",
      period: "/month",
      description: "For professionals and researchers needing unlimited access and power.",
      features: [
        "Unlimited paper access",
        "GPU-accelerated execution",
        "1-on-1 expert support",
        "Advanced interactive visualizations",
        "Early access to new features",
      ],
      buttonText: "Subscribe to Pro",
      isPopular: false,
    },
  ];

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", padding: "80px 24px", display: "flex", flexDirection: "column", alignItems: "center" }} className="animate-fade-in">
      <div style={{ textAlign: "center", marginBottom: 64, maxWidth: 600 }}>
        <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 16, letterSpacing: "-0.02em" }}>Simple, transparent pricing</h1>
        <p style={{ fontSize: 18, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          Choose the plan that best fits your learning and research needs. Upgrade or downgrade at any time.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, maxWidth: 1100, width: "100%" }}>
        {plans.map((plan) => (
          <div
            key={plan.name}
            style={{
              background: "rgba(25, 25, 25, 0.5)",
              border: `1px solid ${plan.isPopular ? "var(--accent-cyan)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 16,
              padding: 32,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
              boxShadow: plan.isPopular ? "0 8px 32px rgba(0, 188, 212, 0.1)" : "none",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            {plan.isPopular && (
              <div
                style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "var(--accent-cyan)",
                  color: "#000",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: 12,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Most Popular
              </div>
            )}
            
            <h3 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>{plan.name}</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24, lineHeight: 1.5, minHeight: 42 }}>
              {plan.description}
            </p>
            
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 32 }}>
              <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.03em" }}>{plan.price}</span>
              {plan.period && <span style={{ color: "var(--text-muted)", fontSize: 16 }}>{plan.period}</span>}
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: 40, flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
              {plan.features.map((feature, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 15, color: "var(--text-secondary)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                background: plan.isPopular ? "var(--text-primary)" : "transparent",
                color: plan.isPopular ? "#000" : "var(--text-primary)",
                border: plan.isPopular ? "none" : "1px solid rgba(255,255,255,0.2)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!plan.isPopular) {
                  (e.target as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                } else {
                  (e.target as HTMLElement).style.opacity = "0.9";
                }
              }}
              onMouseLeave={(e) => {
                if (!plan.isPopular) {
                  (e.target as HTMLElement).style.background = "transparent";
                } else {
                  (e.target as HTMLElement).style.opacity = "1";
                }
              }}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
