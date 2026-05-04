import type { Paper } from "@/data/papers";
import type { CSSProperties } from "react";

interface PaperVisualProps {
  paper: Paper;
}

const panelStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
  background: "rgba(255,255,255,0.025)",
  overflow: "hidden",
};

const labelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--text-muted)",
};

export function PaperVisual({ paper }: PaperVisualProps) {
  if (!paper.visual) return null;

  return (
    <section style={{ margin: "34px 0 44px" }} aria-label={`${paper.title} visualization`}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={labelStyle}>Paper Visualization</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6, marginTop: 6, maxWidth: 720 }}>
            {paper.visual.caption}
          </p>
        </div>
        {paper.visual.tools && paper.visual.tools.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {paper.visual.tools.map((tool) => (
              <a
                key={tool.href}
                href={tool.href}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ textDecoration: "none", padding: "7px 12px", fontSize: 12 }}
              >
                {tool.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {paper.visual.variant === "deepchem" && <DeepChemWorkflow />}
      {paper.visual.variant === "benchmark" && <BenchmarkMatrix />}
      {paper.visual.variant === "molecule" && <MoleculeFingerprint />}
      {paper.visual.variant === "protein" && <ProteinLigandPocket />}
      {paper.visual.variant === "generative" && <GenerativeMolecules />}
    </section>
  );
}

function DeepChemWorkflow() {
  const steps = [
    { label: "Data", value: "Delaney", color: "#22c55e" },
    { label: "Features", value: "GraphConv", color: "#06b6d4" },
    { label: "Model", value: "Dropout 0.2", color: "#8b5cf6" },
    { label: "Metric", value: "Pearson R2", color: "#f59e0b" },
    { label: "Output", value: "LogS", color: "#f43f5e" },
  ];

  return (
    <div style={panelStyle}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 0 }}>
        <div style={{ padding: 22, borderRight: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))", gap: 10 }}>
            {steps.map((step, i) => (
              <div key={step.label} style={{ position: "relative", minHeight: 112 }}>
                {i < steps.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 24,
                      left: "calc(50% + 24px)",
                      right: -34,
                      height: 1,
                      background: "rgba(255,255,255,0.14)",
                    }}
                  />
                )}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    margin: "0 auto 12px",
                    border: `1px solid ${step.color}`,
                    background: `${step.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: step.color,
                    fontWeight: 800,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ textAlign: "center", fontSize: 12, color: "#fff", fontWeight: 700 }}>{step.label}</div>
                <div style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{step.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10 }}>
            {[
              ["Train", "0.93", "#22c55e"],
              ["Test", "0.69", "#06b6d4"],
              ["Random", "0.00", "#71717a"],
            ].map(([label, value, color]) => (
              <div key={label} style={{ padding: 12, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 7 }}>{label}</div>
                <div style={{ height: 6, borderRadius: 6, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div style={{ width: `${Number(value) * 100}%`, height: "100%", background: color }} />
                </div>
                <div style={{ marginTop: 7, fontSize: 17, fontWeight: 800, color }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
        <MoleculeSvg />
      </div>
    </div>
  );
}

function BenchmarkMatrix() {
  const rows = ["ESOL", "QM9", "Tox21", "PDBBind"];
  const cols = ["Split", "Feat", "Model", "Metric"];

  return (
    <div style={{ ...panelStyle, padding: 22 }}>
      <div style={{ display: "grid", gridTemplateColumns: "90px repeat(4, 1fr)", gap: 8 }}>
        <div />
        {cols.map((col) => (
          <div key={col} style={{ ...labelStyle, textAlign: "center" }}>{col}</div>
        ))}
        {rows.map((row, r) => (
          <div key={row} style={{ display: "contents" }}>
            <div key={`${row}-label`} style={{ fontSize: 13, color: "#fff", fontWeight: 700, paddingTop: 10 }}>{row}</div>
            {cols.map((col, c) => {
              const colors = ["#22c55e", "#06b6d4", "#8b5cf6", "#f59e0b"];
              return (
                <div
                  key={`${row}-${col}`}
                  style={{
                    minHeight: 42,
                    borderRadius: 8,
                    border: `1px solid ${colors[(r + c) % colors.length]}55`,
                    background: `${colors[(r + c) % colors.length]}14`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: colors[(r + c) % colors.length],
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {r + c + 1}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function MoleculeFingerprint() {
  const bits = Array.from({ length: 36 }, (_, i) => i);

  return (
    <div style={{ ...panelStyle, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))" }}>
      <MoleculeSvg />
      <div style={{ padding: 22, borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={labelStyle}>Learned Fingerprint</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 6, marginTop: 16 }}>
          {bits.map((bit) => {
            const active = [1, 4, 5, 9, 13, 18, 19, 22, 29, 32].includes(bit);
            const color = bit % 3 === 0 ? "#22c55e" : bit % 3 === 1 ? "#06b6d4" : "#f59e0b";
            return (
              <div
                key={bit}
                style={{
                  aspectRatio: "1",
                  borderRadius: 4,
                  background: active ? color : "rgba(255,255,255,0.05)",
                  opacity: active ? 0.9 : 1,
                }}
              />
            );
          })}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 18 }}>
          {["Radius 0", "Radius 1", "Radius 2"].map((label, i) => (
            <div key={label} style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: 10 }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 5, color: ["#22c55e", "#06b6d4", "#f59e0b"][i] }}>
                {12 + i * 7}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProteinLigandPocket() {
  const ligandAtoms = [
    { x: 150, y: 130, color: "#f59e0b" },
    { x: 205, y: 116, color: "#f59e0b" },
    { x: 248, y: 150, color: "#f59e0b" },
    { x: 224, y: 194, color: "#f59e0b" },
    { x: 170, y: 184, color: "#f59e0b" },
  ];
  const contacts = [
    [122, 95, 150, 130],
    [302, 137, 248, 150],
    [217, 52, 205, 116],
    [320, 206, 224, 194],
  ];
  const proteinAtoms = [
    [122, 95],
    [302, 137],
    [217, 52],
    [320, 206],
  ];

  return (
    <div style={{ ...panelStyle, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))" }}>
      <div style={{ padding: 22 }}>
        <svg viewBox="0 0 520 260" width="100%" height="260" role="img" aria-label="Protein ligand contact map">
          <path d="M47 159 C83 76,151 76,190 137 S312 239,370 151 S455 78,486 126" fill="none" stroke="#22c55e" strokeWidth="3" opacity="0.55" />
          <path d="M54 188 C130 201,142 31,225 75 S318 86,336 173 S452 213,487 132" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.55" />
          {ligandAtoms.map(({ x, y, color }, i) => (
            <circle key={i} cx={x} cy={y} r="13" fill={`${color}25`} stroke={color} strokeWidth="2" />
          ))}
          {contacts.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f43f5e" strokeDasharray="5 6" strokeWidth="2" opacity="0.8" />
          ))}
          {proteinAtoms.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="7" fill="#fff" />
          ))}
        </svg>
      </div>
      <div style={{ padding: 22, borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={labelStyle}>Radial Shells</div>
        {[
          { label: "0-2A", value: 0.32, color: "#22c55e" },
          { label: "2-4A", value: 0.78, color: "#06b6d4" },
          { label: "4-6A", value: 0.54, color: "#f59e0b" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ marginTop: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-secondary)", marginBottom: 7 }}>
              <span>{label}</span>
              <span>{Math.round(Number(value) * 100)}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 8, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ width: `${Number(value) * 100}%`, background: color, height: "100%" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenerativeMolecules() {
  return (
    <div style={{ ...panelStyle, padding: 22 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {[0, 1, 2].map((idx) => (
          <div key={idx} style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 14 }}>
            <MoleculeMini seed={idx} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 12 }}>
              <span style={{ color: "var(--text-muted)" }}>validity</span>
              <span style={{ color: idx === 1 ? "#f59e0b" : "#22c55e", fontWeight: 800 }}>{idx === 1 ? "0.76" : "0.94"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MoleculeSvg() {
  const bonds = [
    [82, 110, 145, 70],
    [145, 70, 213, 104],
    [213, 104, 205, 170],
    [205, 170, 132, 180],
    [132, 180, 82, 110],
    [213, 104, 266, 62],
  ];
  const atoms = [
    { x: 82, y: 110, atom: "C", color: "#22c55e" },
    { x: 145, y: 70, atom: "C", color: "#06b6d4" },
    { x: 213, y: 104, atom: "O", color: "#f59e0b" },
    { x: 205, y: 170, atom: "N", color: "#8b5cf6" },
    { x: 132, y: 180, atom: "C", color: "#22c55e" },
    { x: 266, y: 62, atom: "Cl", color: "#f43f5e" },
  ];

  return (
    <div style={{ padding: 22, minHeight: 240 }}>
      <svg viewBox="0 0 320 220" width="100%" height="220" role="img" aria-label="Molecule graph">
        {bonds.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.32)" strokeWidth="3" strokeLinecap="round" />
        ))}
        {atoms.map(({ x, y, atom, color }) => (
          <g key={`${atom}-${x}`}>
            <circle cx={x} cy={y} r="22" fill={`${color}24`} stroke={color} strokeWidth="2" />
            <text x={x} y={y + 5} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800">
              {atom}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function MoleculeMini({ seed }: { seed: number }) {
  const palettes = [
    ["#22c55e", "#06b6d4", "#f59e0b"],
    ["#06b6d4", "#f43f5e", "#8b5cf6"],
    ["#f59e0b", "#22c55e", "#f43f5e"],
  ];
  const colors = palettes[seed];
  const points = [
    [54, 28],
    [96, 46],
    [88, 92],
    [40, 92],
    [28, 48],
  ];

  return (
    <svg viewBox="0 0 124 118" width="100%" height="118" role="img" aria-label="Generated molecule candidate">
      {points.map(([x, y], i) => {
        const next = points[(i + 1) % points.length];
        return <line key={i} x1={x} y1={y} x2={next[0]} y2={next[1]} stroke="rgba(255,255,255,0.28)" strokeWidth="3" />;
      })}
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="11" fill={`${colors[i % colors.length]}30`} stroke={colors[i % colors.length]} strokeWidth="2" />
      ))}
    </svg>
  );
}
