"use client";

import { useEffect } from "react";
import Link from "next/link";

function getTopicHref(topic: ModalTopic): string {
  if (topic.category === "NUMPY") return `/fundamentals/numpy/${topic.id.replace("numpy-", "")}`;
  if (topic.category === "PANDAS") return `/fundamentals/pandas/${topic.id.replace("pandas-", "")}`;
  return `/fundamentals/ml150/${topic.id}`;
}

export type ModalTopic = {
  id: string;
  title: string;
  category: string;
  description: string;
  tasks: string[];
};

const categoryColors: Record<string, string> = {
  BASICS: "#4a9eff",
  VISION: "#a855f7",
  SEQUENCE: "#22c55e",
  GENERATIVE: "#f97316",
  NLP: "#eab308",
  ADVANCED: "#ef4444",
  NUMPY: "#4a9eff",
  PANDAS: "#22c55e",
};

export const allTopics: ModalTopic[] = [
  // ── ML150 nodes ──
  {
    id: "prerequisites-tensors",
    title: "Prerequisites & Tensors",
    category: "BASICS",
    description: "Master tensor manipulation and basic math ops without autograd.",
    tasks: [
      "Tensor Broadcasting Basics",
      "Matrix Multiplication (Naive vs Vectorized)",
      "Element-wise Operations",
      "Tensor Reshaping & Transposing",
      "Reduction Operations (Sum, Mean, Max)",
      "Vector Norms (L1, L2)",
      "Dot Product & Cross Product",
      "Einstein Summation (einsum)",
      "Gradient of Sum & MatMul",
      "One-Hot Encoding",
      "Softmax Implementation",
      "Cross-Entropy Loss (Manual)",
      "Numerical Stability (Log-Sum-Exp)",
    ],
  },
  {
    id: "neural-network-fundamentals",
    title: "Neural Network Fundamentals",
    category: "BASICS",
    description: "Build and train neural networks from scratch using backpropagation.",
    tasks: [
      "Single Neuron Forward Pass",
      "Multi-layer Perceptron (MLP)",
      "ReLU, Sigmoid, Tanh Activations",
      "Binary Cross-Entropy Loss",
      "Manual Backpropagation",
      "Gradient Descent Optimizer",
      "Mini-batch Training Loop",
      "Weight Initialization (Xavier, He)",
      "Dropout Regularization",
      "Batch Normalization Layer",
      "Learning Rate Scheduling",
      "Train/Val/Test Split",
    ],
  },
  {
    id: "cnns",
    title: "CNNs",
    category: "VISION",
    description: "Build convolutional networks for image classification and detection.",
    tasks: [
      "2D Convolution from Scratch",
      "Max Pooling Layer",
      "Average Pooling Layer",
      "Padding & Stride Mechanics",
      "LeNet-5 Architecture",
      "AlexNet Key Ideas",
      "VGG Block Builder",
      "ResNet Skip Connection",
      "Depthwise Separable Conv",
      "Global Average Pooling",
      "Transfer Learning Fine-tuning",
      "Grad-CAM Visualization",
    ],
  },
  {
    id: "rnns",
    title: "RNNs",
    category: "SEQUENCE",
    description: "Model sequential data with recurrent networks and gating mechanisms.",
    tasks: [
      "Vanilla RNN Cell",
      "Sequence-to-Vector Encoding",
      "LSTM Cell from Scratch",
      "GRU Cell from Scratch",
      "Bidirectional RNN",
      "Stacked LSTM",
      "Sequence Generation (Sampling)",
      "Character-level Language Model",
      "Gradient Clipping",
      "Truncated BPTT",
    ],
  },
  {
    id: "generative-models",
    title: "Generative Models",
    category: "GENERATIVE",
    description: "Learn GANs, VAEs, and diffusion models for image generation.",
    tasks: [
      "Autoencoder Architecture",
      "Variational Autoencoder (VAE)",
      "Reparameterization Trick",
      "GAN Generator & Discriminator",
      "GAN Training Loop",
      "DCGAN Implementation",
      "Wasserstein GAN Loss",
      "Conditional GAN (cGAN)",
      "DDPM Forward Process",
      "DDPM Reverse Denoising",
      "FID Score Calculation",
    ],
  },
  {
    id: "transformers-attention",
    title: "Transformers & Attention",
    category: "NLP",
    description: "Implement attention mechanisms and the full Transformer architecture.",
    tasks: [
      "Scaled Dot-Product Attention",
      "Multi-Head Attention",
      "Positional Encoding (Sinusoidal)",
      "Feed-Forward Sublayer",
      "Layer Normalization",
      "Encoder Block",
      "Decoder Block with Cross-Attention",
      "Full Transformer (Encoder-Decoder)",
      "Causal (Masked) Self-Attention",
      "GPT-style Decoder-only Model",
      "BERT Masked Language Modeling",
      "Token & Positional Embeddings",
    ],
  },
  {
    id: "advanced-topics",
    title: "Advanced Topics",
    category: "ADVANCED",
    description: "Reinforcement learning, meta-learning, efficiency, and deployment.",
    tasks: [
      "Policy Gradient (REINFORCE)",
      "Q-Learning Basics",
      "Actor-Critic Methods",
      "Knowledge Distillation",
      "Quantization (INT8)",
      "Pruning Techniques",
      "LoRA Fine-tuning",
      "RLHF Overview",
      "MAML Meta-learning",
      "Model Parallelism",
      "Mixed Precision Training",
      "ONNX Export & Inference",
    ],
  },
  // ── Numpy sections ──
  {
    id: "numpy-array-basics",
    title: "Array Basics",
    category: "NUMPY",
    description: "Master the fundamentals of NumPy arrays: creation, indexing, operations, and basic manipulations.",
    tasks: [
      "Create 1D / 2D / 3D arrays",
      "np.zeros, np.ones, np.arange",
      "Array dtype and shape",
      "Array slicing and indexing",
      "Array copy vs view",
      "Element-wise arithmetic",
      "np.linspace and np.logspace",
      "Flattening and raveling",
    ],
  },
  {
    id: "numpy-broadcasting",
    title: "Broadcasting",
    category: "NUMPY",
    description: "Learn NumPy's powerful broadcasting mechanism for arrays of different shapes.",
    tasks: [
      "Broadcasting rules walkthrough",
      "Scalar-array operations",
      "Row-wise and column-wise ops",
      "Shape alignment with np.newaxis",
      "Outer product via broadcasting",
      "Normalize rows without loops",
      "Compute pairwise distances",
    ],
  },
  {
    id: "numpy-advanced-indexing",
    title: "Advanced Indexing",
    category: "NUMPY",
    description: "Advanced selection patterns with boolean masks, fancy indexing, and conditional operations.",
    tasks: [
      "Boolean mask indexing",
      "Fancy indexing with integer arrays",
      "np.where conditional selection",
      "np.take and np.put",
      "Multi-dimensional fancy indexing",
      "Structured array access",
      "np.ix_ for outer indexing",
    ],
  },
  {
    id: "numpy-array-manipulation",
    title: "Array Manipulation",
    category: "NUMPY",
    description: "Split, combine, pad, sort, and transform arrays for data preprocessing.",
    tasks: [
      "np.reshape and np.resize",
      "np.concatenate and np.stack",
      "np.split and np.hsplit",
      "np.pad for padding arrays",
      "np.sort and np.argsort",
      "np.unique and counting",
      "np.roll and np.flip",
    ],
  },
  {
    id: "numpy-mathematical-operations",
    title: "Mathematical Operations",
    category: "NUMPY",
    description: "Linear algebra operations, matrix multiplication, and mathematical functions.",
    tasks: [
      "np.dot and np.matmul",
      "np.linalg.inv (matrix inverse)",
      "np.linalg.eig (eigenvalues)",
      "np.linalg.svd",
      "np.linalg.norm",
      "np.linalg.solve",
      "Trigonometric functions",
    ],
  },
  {
    id: "numpy-advanced-broadcasting-einsum",
    title: "Advanced Broadcasting & Einsum",
    category: "NUMPY",
    description: "Master Einstein summation notation and complex tensor operations.",
    tasks: [
      "einsum for matrix multiply",
      "einsum for batch operations",
      "einsum trace and diagonal",
      "einsum outer product",
      "Tensor contractions",
      "np.tensordot",
      "Custom reduction with einsum",
    ],
  },
  {
    id: "numpy-memory-performance",
    title: "Memory & Performance",
    category: "NUMPY",
    description: "Optimize memory usage and performance with views, strides, and vectorization.",
    tasks: [
      "Understanding strides",
      "View vs copy tradeoffs",
      "np.lib.stride_tricks",
      "Vectorizing with np.vectorize",
      "Memory layout (C vs F order)",
      "Profiling NumPy operations",
    ],
  },
  {
    id: "numpy-real-world-applications",
    title: "Real-World Applications",
    category: "NUMPY",
    description: "Apply NumPy to real problems: image processing, time series, and neural networks.",
    tasks: [
      "Image as NumPy array",
      "Grayscale conversion",
      "1D signal smoothing",
      "Manual linear regression",
      "Softmax from scratch",
      "Confusion matrix builder",
    ],
  },
  // ── Pandas sections ──
  {
    id: "pandas-dataframe-basics",
    title: "DataFrame Basics",
    category: "PANDAS",
    description: "Master Pandas DataFrames and Series: creation, inspection, selection, and basic operations.",
    tasks: [
      "Create DataFrame from dict/list",
      "Reading CSV and JSON",
      "df.head(), .info(), .describe()",
      "Selecting columns and rows",
      "Adding and dropping columns",
      "Renaming columns",
      "Value counts and unique",
      "Sorting DataFrames",
    ],
  },
  {
    id: "pandas-indexing-selection",
    title: "Indexing & Selection",
    category: "PANDAS",
    description: "Label-based and position-based indexing, MultiIndex, and advanced selection.",
    tasks: [
      "df.loc[] label-based selection",
      "df.iloc[] position-based selection",
      "Boolean filtering",
      "MultiIndex creation",
      "MultiIndex slicing with xs()",
      "Index reset and set",
    ],
  },
  {
    id: "pandas-data-cleaning",
    title: "Data Cleaning",
    category: "PANDAS",
    description: "Handle missing data, convert types, detect duplicates, process strings.",
    tasks: [
      "Detecting NaN values",
      "fillna() strategies",
      "dropna() with thresholds",
      "Duplicate detection and removal",
      "Type conversion with astype()",
      "String cleaning with .str",
      "Outlier detection with IQR",
    ],
  },
  {
    id: "pandas-groupby-operations",
    title: "GroupBy Operations",
    category: "PANDAS",
    description: "Group data and apply aggregations, transformations, and filters.",
    tasks: [
      "groupby().agg()",
      "groupby().transform()",
      "groupby().filter()",
      "Multiple aggregations",
      "Pivot tables with pd.pivot_table",
      "Crosstab analysis",
      "Named aggregation",
    ],
  },
  {
    id: "pandas-merging-joining",
    title: "Merging & Joining",
    category: "PANDAS",
    description: "Combine DataFrames with merge, join, and concat.",
    tasks: [
      "pd.merge() inner/outer/left/right",
      "Multi-key joins",
      "pd.concat() axis=0 and axis=1",
      "df.join() on index",
      "Handling duplicate columns",
      "Merge indicator column",
      "Time-series merge_asof",
    ],
  },
  {
    id: "pandas-time-series",
    title: "Time Series",
    category: "PANDAS",
    description: "Work with datetime data: parse dates, resample, rolling statistics, timezones.",
    tasks: [
      "pd.to_datetime() parsing",
      "DatetimeIndex basics",
      "Resampling with .resample()",
      "Rolling window statistics",
      "Shift and diff operations",
      "Timezone localization",
      "Period and DateOffset",
    ],
  },
  {
    id: "pandas-performance-optimization",
    title: "Performance Optimization",
    category: "PANDAS",
    description: "Write efficient Pandas code: vectorization, memory, chunking, method chaining.",
    tasks: [
      "Vectorized operations vs loops",
      "Categorical dtype for strings",
      "Chunked CSV reading",
      "Method chaining patterns",
      "Memory usage profiling",
      "eval() and query() speed",
    ],
  },
  {
    id: "pandas-real-world-applications",
    title: "Real-World Applications",
    category: "PANDAS",
    description: "Apply everything to practical problems: data pipelines, sales analysis, A/B testing.",
    tasks: [
      "Sales data pipeline",
      "A/B test statistical analysis",
      "Customer cohort analysis",
      "Time series forecasting prep",
      "Data quality report generator",
    ],
  },
];

// ─── Modal Component ──────────────────────────────────────────────────────────

export default function FundamentalsModal({
  topic,
  onClose,
}: {
  topic: ModalTopic;
  onClose: () => void;
}) {
  const color = categoryColors[topic.category] || "#fff";

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        animation: "fadeIn 0.15s ease",
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        .task-item:hover { background: #161616 !important; border-color: #444 !important; }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#080808",
          border: "1px solid #2a2a2a",
          borderRadius: 18,
          width: "100%", maxWidth: 640,
          maxHeight: "85vh",
          overflowY: "auto",
          padding: 32,
          animation: "slideUp 0.2s ease",
          boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
        }}
      >
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <span
            style={{
              fontSize: 10, fontWeight: 800, letterSpacing: 2,
              color, background: color + "18",
              border: `1px solid ${color}44`,
              padding: "4px 10px", borderRadius: 6,
            }}
          >
            {topic.category}
          </span>
          <span
            style={{
              fontSize: 11, fontWeight: 600, color: "#666",
              background: "#111", border: "1px solid #2a2a2a",
              padding: "4px 10px", borderRadius: 6,
            }}
          >
            Progress &nbsp;<span style={{ color: "#fff" }}>0%</span>
          </span>
          <button
            onClick={onClose}
            style={{
              marginLeft: "auto", background: "none", border: "none",
              color: "#666", fontSize: 20, cursor: "pointer", lineHeight: 1,
              padding: "2px 6px", borderRadius: 6,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "white"; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "#666"; }}
          >
            ×
          </button>
        </div>

        {/* Title & Description */}
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 10, letterSpacing: "-0.02em" }}>
          {topic.title}
        </h2>
        <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6, marginBottom: 28 }}>
          {topic.description}
        </p>

        {/* Tasks */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#555" }}>
              CORE CONCEPTS
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {topic.tasks.map((task, i) => (
              <div
                key={i}
                className="task-item"
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "#0d0d0d", border: "1px solid #1e1e1e",
                  borderRadius: 8, padding: "10px 14px",
                  cursor: "pointer", transition: "all 0.15s",
                  gridColumn: topic.tasks.length % 2 !== 0 && i === topic.tasks.length - 1 ? "1 / -1" : undefined,
                }}
              >
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: color, flexShrink: 0, opacity: 0.8,
                }} />
                <span style={{ fontSize: 13, color: "#ccc", lineHeight: 1.4 }}>{task}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer buttons */}
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "11px 28px", borderRadius: 10,
              background: "transparent", border: "1px solid #333",
              color: "#aaa", fontSize: 14, fontWeight: 600, cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = "#555"; (e.target as HTMLElement).style.color = "white"; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = "#333"; (e.target as HTMLElement).style.color = "#aaa"; }}
          >
            Close
          </button>
          <Link
            href={getTopicHref(topic)}
            onClick={onClose}
            style={{
              padding: "11px 28px", borderRadius: 10,
              background: "white", border: "none",
              color: "black", fontSize: 14, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
              transition: "all 0.15s",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#e5e5e5"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "white"; }}
          >
            Start Learning
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
