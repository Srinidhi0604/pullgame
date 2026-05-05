"use client";

import { useMemo, useState } from "react";
import FundamentalsModal, { allTopics, type ModalTopic } from "@/components/FundamentalsModal";

type Section = {
  id: number;
  topicId: string;
  title: string;
  rows: number;
  impact: string;
};

type Track = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  accent: string;
  sections: Section[];
};

const ml150Sections: Section[] = [
  { id: 1, topicId: "prerequisites-tensors", title: "Prerequisites and Tensors", rows: 13, impact: "Used in model training, vector search, data pipelines, and every tensor-based AI system." },
  { id: 2, topicId: "neural-network-fundamentals", title: "Neural Network Fundamentals", rows: 12, impact: "Used in classifiers, recommendation engines, forecasting systems, and learned product features." },
  { id: 3, topicId: "cnns", title: "CNNs", rows: 12, impact: "Used in medical imaging, quality inspection, robotics vision, and visual search." },
  { id: 4, topicId: "rnns", title: "RNNs", rows: 10, impact: "Used in sequence modeling, telemetry forecasting, speech, and time-series products." },
  { id: 5, topicId: "generative-models", title: "Generative Models", rows: 11, impact: "Used in image generation, simulation, data augmentation, and creative tooling." },
  { id: 6, topicId: "transformers-attention", title: "Transformers and Attention", rows: 12, impact: "Used in LLMs, search rerankers, copilots, translation, and document intelligence." },
  { id: 7, topicId: "advanced-topics", title: "Advanced Topics", rows: 12, impact: "Used in deployment, fine-tuning, RL systems, compression, and production AI operations." },
];

const numpySections: Section[] = [
  { id: 1, topicId: "numpy-array-basics", title: "Array Basics", rows: 8, impact: "Used in image arrays, scientific data, tensor preparation, and numerical simulation." },
  { id: 2, topicId: "numpy-broadcasting", title: "Broadcasting", rows: 6, impact: "Used in fast batch math for ML, signal processing, normalization, and simulation grids." },
  { id: 3, topicId: "numpy-advanced-indexing", title: "Advanced Indexing", rows: 7, impact: "Used in filtering datasets, feature extraction, masks, and vectorized data cleanup." },
  { id: 4, topicId: "numpy-array-manipulation", title: "Array Manipulation", rows: 7, impact: "Used in preprocessing pipelines, reshaping tensors, and batching numerical workloads." },
  { id: 5, topicId: "numpy-mathematical-operations", title: "Mathematical Operations", rows: 7, impact: "Used in optimization, linear systems, statistics, graphics, and engineering models." },
  { id: 6, topicId: "numpy-advanced-broadcasting-einsum", title: "Broadcasting and Einsum", rows: 7, impact: "Used in attention layers, batched linear algebra, physics simulation, and tensor contractions." },
  { id: 7, topicId: "numpy-memory-performance", title: "Memory and Performance", rows: 5, impact: "Used in high-volume analytics where copies, strides, and memory layout decide latency." },
  { id: 8, topicId: "numpy-real-world-applications", title: "Real-World Applications", rows: 3, impact: "Used in image processing, time-series smoothing, ML metrics, and compact prototypes." },
];

const pandasSections: Section[] = [
  { id: 1, topicId: "pandas-dataframe-basics", title: "DataFrame Basics", rows: 8, impact: "Used in analysis notebooks, ETL checks, business reporting, and tabular feature prep." },
  { id: 2, topicId: "pandas-indexing-selection", title: "Indexing and Selection", rows: 6, impact: "Used in analyst workflows, cohort slices, experiment reads, and operations dashboards." },
  { id: 3, topicId: "pandas-data-cleaning", title: "Data Cleaning", rows: 7, impact: "Used in data quality pipelines, reporting automation, ingestion, and compliance checks." },
  { id: 4, topicId: "pandas-groupby-operations", title: "GroupBy Operations", rows: 7, impact: "Used in metrics rollups, customer cohorts, experiment analysis, and KPI computation." },
  { id: 5, topicId: "pandas-merging-joining", title: "Merging and Joining", rows: 7, impact: "Used in warehouse extracts, entity resolution, feature tables, and multi-source analytics." },
  { id: 6, topicId: "pandas-time-series", title: "Time Series", rows: 7, impact: "Used in forecasting prep, observability, finance, energy, and product telemetry." },
  { id: 7, topicId: "pandas-performance-optimization", title: "Performance Optimization", rows: 5, impact: "Used when tables grow large enough that memory, chunking, and vectorization matter." },
  { id: 8, topicId: "pandas-real-world-applications", title: "Real-World Applications", rows: 3, impact: "Used in sales analysis, A/B testing, cohort analysis, and data quality reports." },
];

const biologySections: Section[] = [
  { id: 1, topicId: "biology-sequence-alignment", title: "Sequence Alignment", rows: 3, impact: "Used in genome search, variant triage, pathogen tracking, and homology detection." },
  { id: 2, topicId: "biology-gene-expression", title: "Gene Expression", rows: 3, impact: "Used in single-cell atlases, biomarkers, perturbation screens, and drug-response studies." },
  { id: 3, topicId: "biology-protein-structure", title: "Protein Structure", rows: 3, impact: "Used in protein folding, docking validation, enzyme design, and structure review." },
  { id: 4, topicId: "biology-variant-analysis", title: "Variant Analysis", rows: 3, impact: "Used in clinical genomics, cohort summaries, population genetics, and genome reports." },
];

const chemistrySections: Section[] = [
  { id: 1, topicId: "chemistry-molecular-representations", title: "Molecular Representations", rows: 3, impact: "Used in molecule search, lab inventory, graph construction, and property prediction." },
  { id: 2, topicId: "chemistry-fingerprints-similarity", title: "Fingerprints and Similarity", rows: 3, impact: "Used in virtual screening, analog search, duplicate detection, and compound clustering." },
  { id: 3, topicId: "chemistry-reaction-analysis", title: "Reaction Analysis", rows: 3, impact: "Used in reaction planning, yield optimization, lab automation, and data validation." },
  { id: 4, topicId: "chemistry-docking-energetics", title: "Docking and Energetics", rows: 3, impact: "Used in docking dashboards, hit triage, lead optimization, and pose verification." },
];

const electricalSections: Section[] = [
  { id: 1, topicId: "electrical-circuits-signals", title: "Circuits and Signals", rows: 3, impact: "Used in power electronics, sensor front ends, filters, and measurement instruments." },
  { id: 2, topicId: "electrical-power-systems", title: "Power Systems", rows: 3, impact: "Used in grid planning, microgrids, outage studies, and energy-management systems." },
  { id: 3, topicId: "electrical-control-systems", title: "Control Systems", rows: 3, impact: "Used in robotics, motor drives, industrial control, and physical system regulation." },
  { id: 4, topicId: "electrical-signal-processing", title: "Signal Processing", rows: 3, impact: "Used in audio, radar, medical sensors, vibration monitoring, and IoT analytics." },
];

const electronicsSections: Section[] = [
  { id: 1, topicId: "electronics-digital-logic", title: "Digital Logic", rows: 3, impact: "Used in CPUs, FPGAs, ALUs, memory controllers, and verification tooling." },
  { id: 2, topicId: "electronics-sequential-logic", title: "Sequential Logic", rows: 3, impact: "Used in timers, protocols, instruction pipelines, and hardware state machines." },
  { id: 3, topicId: "electronics-cmos-analog", title: "CMOS and Analog Basics", rows: 3, impact: "Used in chip timing, power budgets, inverter design, and low-power electronics." },
  { id: 4, topicId: "electronics-embedded-systems", title: "Embedded Systems", rows: 3, impact: "Used in firmware tools, microcontrollers, sensor devices, and low-level datapaths." },
];

const tracks: Track[] = [
  {
    id: "ML150",
    label: "ML150",
    title: "ML150 Fundamentals",
    subtitle: "Machine-learning foundations that connect from tensor math to deployable AI systems.",
    accent: "#4a9eff",
    sections: ml150Sections,
  },
  {
    id: "Numpy",
    label: "NumPy",
    title: "NumPy Fundamentals",
    subtitle: "Numerical programming implementations for tensors, simulation, image data, and scientific workloads.",
    accent: "#38bdf8",
    sections: numpySections,
  },
  {
    id: "Pandas",
    label: "Pandas",
    title: "Pandas Fundamentals",
    subtitle: "Tabular-data implementations for analytics, cleaning, reporting, and production data preparation.",
    accent: "#22c55e",
    sections: pandasSections,
  },
  {
    id: "Biology",
    label: "Biology",
    title: "Biology Fundamentals",
    subtitle: "Bioinformatics and computational biology implementations tied to lab, clinical, and research systems.",
    accent: "#10b981",
    sections: biologySections,
  },
  {
    id: "Chemistry",
    label: "Chemistry",
    title: "Chemistry Fundamentals",
    subtitle: "Cheminformatics and reaction-analysis implementations used in discovery, screening, and lab automation.",
    accent: "#f59e0b",
    sections: chemistrySections,
  },
  {
    id: "EE",
    label: "EE",
    title: "Electrical Engineering Fundamentals",
    subtitle: "Circuits, power, control, and signal-processing implementations used in real physical systems.",
    accent: "#06b6d4",
    sections: electricalSections,
  },
  {
    id: "Electronics",
    label: "Electronics",
    title: "Electronics Fundamentals",
    subtitle: "Digital logic, CMOS, sequential systems, and embedded implementations used in chips and devices.",
    accent: "#ec4899",
    sections: electronicsSections,
  },
];

const topicById = Object.fromEntries(allTopics.map((topic) => [topic.id, topic]));

function SectionCard({
  section,
  accent,
  onOpen,
}: {
  section: Section;
  accent: string;
  onOpen: (topic: ModalTopic) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const topic = topicById[section.topicId];

  return (
    <button
      type="button"
      onClick={() => topic && onOpen(topic)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        minHeight: 260,
        textAlign: "left",
        background: hovered ? "#0c0c0c" : "#050505",
        border: `1px solid ${hovered ? accent : "#222"}`,
        borderRadius: 8,
        padding: 24,
        color: "white",
        cursor: topic ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.18s ease, background 0.18s ease, transform 0.18s ease",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <span
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: `${accent}18`,
            border: `1px solid ${accent}66`,
            color: accent,
            fontSize: 13,
            fontWeight: 800,
          }}
        >
          {section.id}
        </span>
        <span
          style={{
            padding: "5px 9px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.05)",
            color: "#aeb4bf",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {section.rows} tasks
        </span>
      </div>

      <h2 style={{ margin: 0, marginBottom: 10, color: "white", fontSize: 20, lineHeight: 1.25, fontWeight: 800, letterSpacing: 0 }}>
        {section.title}
      </h2>
      <p style={{ margin: 0, color: "#9ca3af", fontSize: 14, lineHeight: 1.6 }}>
        {topic?.description ?? "Implementation-focused fundamentals for real-world systems."}
      </p>

      <div style={{ marginTop: "auto", paddingTop: 18, borderTop: "1px solid #202020" }}>
        <div style={{ color: accent, fontSize: 10, fontWeight: 900, letterSpacing: 0, marginBottom: 7 }}>
          REAL-WORLD USE
        </div>
        <p style={{ margin: 0, color: "#c5cad3", fontSize: 12.5, lineHeight: 1.55 }}>
          {section.impact}
        </p>
      </div>
    </button>
  );
}

export default function FundamentalsPage() {
  const [activeTrackId, setActiveTrackId] = useState<Track["id"]>("ML150");
  const [modal, setModal] = useState<ModalTopic | null>(null);

  const activeTrack = useMemo(
    () => tracks.find((track) => track.id === activeTrackId) ?? tracks[0],
    [activeTrackId],
  );

  return (
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: "36px 24px 120px", color: "white" }}>
      {modal && <FundamentalsModal topic={modal} onClose={() => setModal(null)} />}

      <nav style={{ display: "flex", justifyContent: "center", marginBottom: 42 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 4,
            padding: 5,
            background: "#080808",
            border: "1px solid #202020",
            borderRadius: 8,
          }}
        >
          {tracks.map((track) => {
            const selected = activeTrack.id === track.id;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => setActiveTrackId(track.id)}
                style={{
                  minWidth: 78,
                  padding: "10px 14px",
                  borderRadius: 7,
                  border: selected ? `1px solid ${track.accent}66` : "1px solid transparent",
                  background: selected ? `${track.accent}18` : "transparent",
                  color: selected ? "white" : "#8b93a1",
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: "pointer",
                  letterSpacing: 0,
                }}
              >
                {track.label}
              </button>
            );
          })}
        </div>
      </nav>

      <section style={{ marginBottom: 34 }}>
        <div style={{ color: activeTrack.accent, fontSize: 12, fontWeight: 900, letterSpacing: 0, marginBottom: 10 }}>
          FUNDAMENTALS TRACK
        </div>
        <h1 style={{ margin: 0, marginBottom: 12, fontSize: 44, lineHeight: 1.08, fontWeight: 900, letterSpacing: 0, overflowWrap: "anywhere" }}>
          {activeTrack.title}
        </h1>
        <p style={{ margin: 0, maxWidth: 760, color: "#a7afbd", fontSize: 16, lineHeight: 1.65 }}>
          {activeTrack.subtitle}
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {activeTrack.sections.map((section) => (
          <SectionCard
            key={section.topicId}
            section={section}
            accent={activeTrack.accent}
            onOpen={setModal}
          />
        ))}
      </section>
    </main>
  );
}
