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
      {paper.visual.variant !== "deepchem" &&
        paper.visual.variant !== "benchmark" &&
        paper.visual.variant !== "molecule" &&
        paper.visual.variant !== "protein" &&
        paper.visual.variant !== "generative" && <DomainResearchVisual variant={paper.visual.variant} />}
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

function DomainResearchVisual({ variant }: { variant: NonNullable<Paper["visual"]>["variant"] }) {
  if (variant === "genomics" || variant === "single-cell" || variant === "cell" || variant === "structure" || variant === "phylogeny") {
    return <BiologyVisual variant={variant} />;
  }
  if (variant === "chemistry" || variant === "chemistry-3d" || variant === "docking" || variant === "reaction") {
    return <ChemistryVisual variant={variant} />;
  }
  if (variant === "power" || variant === "signals" || variant === "machines") {
    return <ElectricalVisual variant={variant} />;
  }
  return <ElectronicsVisual variant={variant} />;
}

function BiologyVisual({ variant }: { variant: string }) {
  const colors = variant === "cell" ? ["#22c55e", "#06b6d4", "#f59e0b"] : ["#06b6d4", "#8b5cf6", "#22c55e"];
  return (
    <div style={{ ...panelStyle, padding: 22 }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(min(100%, 360px), 1.2fr) minmax(min(100%, 260px), 0.8fr)", gap: 18 }}>
        <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 16, background: "rgba(0,0,0,0.28)" }}>
          <svg viewBox="0 0 520 250" width="100%" height="250" role="img" aria-label="Biology paper visualization">
            {variant === "structure" ? (
              <>
                <path d="M52 160 C92 55,154 78,183 125 S280 235,335 143 S432 67,470 117" fill="none" stroke="#22c55e" strokeWidth="4" opacity="0.55" />
                <path d="M75 195 C145 205,165 46,235 73 S330 84,356 172 S448 218,484 126" fill="none" stroke="#06b6d4" strokeWidth="3" opacity="0.55" />
                {[70, 116, 162, 208, 254, 300, 346, 392, 438].map((x, index) => (
                  <circle key={x} cx={x} cy={index % 2 ? 98 : 150} r="10" fill={colors[index % colors.length]} opacity="0.9" />
                ))}
                {[0, 1, 2, 3, 4].map((index) => (
                  <line key={index} x1={100 + index * 62} y1="88" x2={145 + index * 58} y2="172" stroke="#f43f5e" strokeDasharray="5 7" strokeWidth="2" />
                ))}
              </>
            ) : variant === "cell" ? (
              <>
                {Array.from({ length: 18 }, (_, index) => {
                  const x = 55 + (index % 6) * 72 + (index % 2) * 12;
                  const y = 45 + Math.floor(index / 6) * 64;
                  return <ellipse key={index} cx={x} cy={y} rx={22 + (index % 3) * 4} ry={16 + (index % 2) * 5} fill={`${colors[index % colors.length]}2e`} stroke={colors[index % colors.length]} strokeWidth="2" />;
                })}
                <path d="M48 210 C128 170,188 236,259 194 S405 160,478 207" fill="none" stroke="#fff" opacity="0.18" strokeWidth="2" />
              </>
            ) : variant === "phylogeny" ? (
              <>
                {[
                  [70, 125, 170, 75],
                  [70, 125, 170, 175],
                  [170, 75, 280, 50],
                  [170, 75, 280, 100],
                  [170, 175, 280, 150],
                  [170, 175, 280, 205],
                  [280, 50, 420, 42],
                  [280, 100, 420, 98],
                  [280, 150, 420, 150],
                  [280, 205, 420, 212],
                ].map(([x1, y1, x2, y2], index) => (
                  <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
                ))}
                {[70, 170, 280, 420].map((x, i) => (
                  <circle key={x} cx={x} cy={[125, 75, 150, 98][i]} r="9" fill={colors[i % colors.length]} />
                ))}
              </>
            ) : (
              <>
                {Array.from({ length: 34 }, (_, index) => (
                  <rect key={index} x={28 + index * 14} y={36 + (index % 4) * 24} width="10" height={18 + (index % 3) * 10} rx="3" fill={colors[index % colors.length]} opacity={index % 5 === 0 ? 1 : 0.45} />
                ))}
                {[0, 1, 2, 3].map((row) => (
                  <path key={row} d={`M30 ${154 + row * 18} C130 ${120 + row * 8}, 220 ${194 - row * 14}, 488 ${142 + row * 12}`} fill="none" stroke={colors[row % colors.length]} strokeWidth="2" opacity="0.65" />
                ))}
              </>
            )}
          </svg>
        </div>
        <MetricPanel
          title={variant === "cell" ? "Segmentation" : variant === "structure" ? "Structure" : variant === "phylogeny" ? "Tree Build" : "Sequence Tracks"}
          rows={[
            ["feature bins", "896", "#06b6d4"],
            ["confidence", "0.87", "#22c55e"],
            ["visual layers", "4", "#f59e0b"],
          ]}
        />
      </div>
    </div>
  );
}

function ChemistryVisual({ variant }: { variant: string }) {
  return (
    <div style={{ ...panelStyle, padding: 22 }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(min(100%, 320px), 1fr) minmax(min(100%, 320px), 1fr)", gap: 18 }}>
        <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 16, background: "rgba(0,0,0,0.28)" }}>
          <svg viewBox="0 0 520 250" width="100%" height="250" role="img" aria-label="Chemistry paper visualization">
            {[
              [105, 80, 174, 46],
              [174, 46, 248, 82],
              [248, 82, 242, 158],
              [242, 158, 164, 188],
              [164, 188, 96, 146],
              [96, 146, 105, 80],
              [248, 82, 337, 58],
              [337, 58, 420, 105],
              [337, 58, 376, 172],
            ].map(([x1, y1, x2, y2], index) => (
              <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.34)" strokeWidth="4" strokeLinecap="round" />
            ))}
            {[
              { x: 105, y: 80, atom: "C", color: "#22c55e" },
              { x: 174, y: 46, atom: "N", color: "#06b6d4" },
              { x: 248, y: 82, atom: "O", color: "#f59e0b" },
              { x: 242, y: 158, atom: "C", color: "#22c55e" },
              { x: 164, y: 188, atom: "S", color: "#8b5cf6" },
              { x: 96, y: 146, atom: "C", color: "#22c55e" },
              { x: 337, y: 58, atom: "Cl", color: "#f43f5e" },
              { x: 420, y: 105, atom: "F", color: "#06b6d4" },
              { x: 376, y: 172, atom: "Br", color: "#f97316" },
            ].map(({ x, y, atom, color }) => (
              <g key={`${atom}-${x}`}>
                <circle cx={x} cy={y} r="22" fill={`${color}28`} stroke={color} strokeWidth="2" />
                <text x={x} y={y + 5} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="800">{atom}</text>
              </g>
            ))}
            {variant === "docking" && <path d="M70 214 C145 160,210 232,282 181 S417 157,470 212" fill="none" stroke="#f43f5e" strokeDasharray="6 8" strokeWidth="2" />}
            {variant === "reaction" && <path d="M54 218 L466 218 M438 202 L466 218 L438 234" stroke="#f59e0b" strokeWidth="4" fill="none" strokeLinecap="round" />}
          </svg>
        </div>
        <MetricPanel
          title={variant === "reaction" ? "Reaction View" : variant === "docking" ? "Docking View" : "Molecule View"}
          rows={[
            ["graph atoms", "9", "#22c55e"],
            ["fingerprint bits", "2048", "#06b6d4"],
            ["score", variant === "docking" ? "-7.4" : "0.91", "#f59e0b"],
          ]}
        />
      </div>
    </div>
  );
}

function ElectricalVisual({ variant }: { variant: string }) {
  return (
    <div style={{ ...panelStyle, padding: 22 }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(min(100%, 380px), 1.2fr) minmax(min(100%, 260px), 0.8fr)", gap: 18 }}>
        <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 16, background: "rgba(0,0,0,0.28)" }}>
          <svg viewBox="0 0 540 260" width="100%" height="260" role="img" aria-label="Electrical systems visualization">
            {variant === "power" || variant === "machines" ? (
              <>
                {[
                  [98, 70],
                  [240, 50],
                  [392, 86],
                  [158, 190],
                  [328, 196],
                  [452, 174],
                ].map(([x, y], index) => (
                  <g key={index}>
                    <circle cx={x} cy={y} r="18" fill={index % 2 ? "#06b6d430" : "#22c55e30"} stroke={index % 2 ? "#06b6d4" : "#22c55e"} strokeWidth="2" />
                    <text x={x} y={y + 5} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="800">{index + 1}</text>
                  </g>
                ))}
                {[
                  [98, 70, 240, 50],
                  [240, 50, 392, 86],
                  [98, 70, 158, 190],
                  [158, 190, 328, 196],
                  [328, 196, 452, 174],
                  [392, 86, 452, 174],
                  [240, 50, 328, 196],
                ].map(([x1, y1, x2, y2], index) => (
                  <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.26)" strokeWidth="4" />
                ))}
                <path d="M62 230 C130 168,180 238,252 190 S386 146,496 210" fill="none" stroke="#f59e0b" strokeWidth="3" opacity="0.85" />
              </>
            ) : (
              <>
                {[0, 1, 2].map((row) => (
                  <path key={row} d={`M30 ${70 + row * 48} C130 ${24 + row * 35}, 220 ${122 + row * 8}, 510 ${58 + row * 45}`} fill="none" stroke={["#06b6d4", "#22c55e", "#f59e0b"][row]} strokeWidth="3" opacity="0.86" />
                ))}
                {Array.from({ length: 18 }, (_, index) => (
                  <rect key={index} x={42 + index * 25} y={194 - (index % 5) * 18} width="14" height={34 + (index % 4) * 13} rx="4" fill={index % 3 === 0 ? "#06b6d4" : index % 3 === 1 ? "#22c55e" : "#f59e0b"} opacity="0.45" />
                ))}
              </>
            )}
          </svg>
        </div>
        <MetricPanel
          title={variant === "power" ? "Grid Solver" : variant === "machines" ? "Machine Model" : "Signal Model"}
          rows={[
            ["nodes", variant === "signals" ? "512" : "6", "#06b6d4"],
            ["converged", "yes", "#22c55e"],
            ["residual", "1e-4", "#f59e0b"],
          ]}
        />
      </div>
    </div>
  );
}

function ElectronicsVisual({ variant }: { variant: string }) {
  return (
    <div style={{ ...panelStyle, padding: 22 }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(min(100%, 380px), 1.2fr) minmax(min(100%, 260px), 0.8fr)", gap: 18 }}>
        <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 16, background: "rgba(0,0,0,0.28)" }}>
          <svg viewBox="0 0 540 260" width="100%" height="260" role="img" aria-label="Electronics and HDL visualization">
            {variant === "logic" || variant === "layout" ? (
              <>
                {[0, 1, 2, 3].map((row) => (
                  <path key={row} d={`M35 ${52 + row * 42} H142 C180 ${52 + row * 42}, 180 ${66 + row * 42}, 216 ${66 + row * 42} H312 V${92 + row * 24} H476`} fill="none" stroke={["#06b6d4", "#22c55e", "#f59e0b", "#f43f5e"][row]} strokeWidth="3" opacity="0.75" />
                ))}
                {[
                  [160, 45, "AND"],
                  [315, 91, "MUX"],
                  [240, 170, "DFF"],
                  [405, 142, "ALU"],
                ].map(([x, y, label], index) => (
                  <g key={String(label)}>
                    <rect x={Number(x)} y={Number(y)} width="72" height="42" rx="7" fill="rgba(255,255,255,0.05)" stroke={["#06b6d4", "#22c55e", "#f59e0b", "#f43f5e"][index]} />
                    <text x={Number(x) + 36} y={Number(y) + 26} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="800">{label}</text>
                  </g>
                ))}
              </>
            ) : (
              <>
                <path d="M48 150 H132 L160 88 L208 210 L255 78 L300 150 H492" fill="none" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" />
                <path d="M54 52 H480 M54 210 H480" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
                {[
                  [105, 150, "R"],
                  [208, 210, "C"],
                  [300, 150, "M"],
                  [390, 150, "ADC"],
                ].map(([x, y, label], index) => (
                  <g key={String(label)}>
                    <circle cx={Number(x)} cy={Number(y)} r="22" fill={["#06b6d4", "#22c55e", "#f59e0b", "#f43f5e"][index] + "2a"} stroke={["#06b6d4", "#22c55e", "#f59e0b", "#f43f5e"][index]} strokeWidth="2" />
                    <text x={Number(x)} y={Number(y) + 5} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="800">{label}</text>
                  </g>
                ))}
              </>
            )}
          </svg>
        </div>
        <MetricPanel
          title={variant === "logic" || variant === "layout" ? "HDLBits-Style Track" : "Circuit Model"}
          rows={[
            ["gates", variant === "logic" ? "24" : "8", "#06b6d4"],
            ["delay", "3.2 ns", "#f59e0b"],
            ["checks", "2 tasks", "#22c55e"],
          ]}
        />
      </div>
    </div>
  );
}

function MetricPanel({ title, rows }: { title: string; rows: [string, string, string][] }) {
  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 16, background: "rgba(255,255,255,0.03)" }}>
      <div style={labelStyle}>{title}</div>
      <div style={{ marginTop: 16, display: "grid", gap: 11 }}>
        {rows.map(([label, value, color]) => (
          <div key={label} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 14, alignItems: "center" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>{label}</span>
            <span style={{ color, fontSize: 18, fontWeight: 800, fontFamily: "var(--font-mono)" }}>{value}</span>
            <div style={{ gridColumn: "1 / -1", height: 6, borderRadius: 6, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ width: value === "yes" ? "92%" : value.includes("tasks") ? "66%" : "78%", height: "100%", background: color }} />
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
