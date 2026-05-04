export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  joinDate: string;
  plan: "free" | "pro";
  problemsSolved: number;
  currentStreak: number;
  maxStreak: number;
  score: number;
  rank: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  badges: Badge[];
  submissions: Submission[];
  heatmapData: Record<string, number>;
}

export interface Badge {
  id: string;
  type: "first_blood" | "on_a_roll" | "paper_master";
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface Submission {
  id: string;
  problemSlug: string;
  problemTitle: string;
  status: "passed" | "failed";
  submittedAt: string;
}

function generateHeatmap(): Record<string, number> {
  const data: Record<string, number> = {};
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const rand = Math.random();
    if (rand > 0.6) {
      data[key] = Math.floor(Math.random() * 5) + 1;
    }
  }
  return data;
}

export const badgeDefinitions: Record<string, Omit<Badge, "id" | "earnedAt">> = {
  first_blood: {
    type: "first_blood",
    title: "First Blood",
    description: "Solved your first problem",
    icon: "🩸",
  },
  on_a_roll: {
    type: "on_a_roll",
    title: "On a Roll",
    description: "Maintained a 7-day streak",
    icon: "🔥",
  },
  paper_master: {
    type: "paper_master",
    title: "Paper Master",
    description: "Solved 50 problems",
    icon: "📄",
  },
};

export const mockUsers: UserProfile[] = [
  {
    id: "1",
    username: "arxiv_ninja",
    email: "ninja@example.com",
    avatarUrl: "",
    joinDate: "2024-09-15",
    plan: "pro",
    problemsSolved: 67,
    currentStreak: 14,
    maxStreak: 31,
    easySolved: 25,
    mediumSolved: 28,
    hardSolved: 14,
    score: 25 * 1 + 28 * 2 + 14 * 3,
    rank: 1,
    badges: [
      { id: "b1", type: "first_blood", title: "First Blood", description: "Solved your first problem", icon: "🩸", earnedAt: "2024-09-16" },
      { id: "b2", type: "on_a_roll", title: "On a Roll", description: "Maintained a 7-day streak", icon: "🔥", earnedAt: "2024-09-23" },
      { id: "b3", type: "paper_master", title: "Paper Master", description: "Solved 50 problems", icon: "📄", earnedAt: "2024-12-01" },
    ],
    submissions: [
      { id: "s1", problemSlug: "scaled-dot-product-attention", problemTitle: "Scaled Dot-Product Attention", status: "passed", submittedAt: "2025-05-03" },
      { id: "s2", problemSlug: "multi-head-attention", problemTitle: "Multi-Head Attention", status: "passed", submittedAt: "2025-05-02" },
      { id: "s3", problemSlug: "transformer-encoder", problemTitle: "Transformer Encoder Block", status: "failed", submittedAt: "2025-05-01" },
      { id: "s4", problemSlug: "layer-normalization", problemTitle: "Layer Normalization", status: "passed", submittedAt: "2025-04-30" },
      { id: "s5", problemSlug: "adam-optimizer", problemTitle: "Adam Optimizer", status: "passed", submittedAt: "2025-04-29" },
    ],
    heatmapData: generateHeatmap(),
  },
  {
    id: "2",
    username: "gradient_queen",
    email: "queen@example.com",
    avatarUrl: "",
    joinDate: "2024-10-01",
    plan: "pro",
    problemsSolved: 54,
    currentStreak: 9,
    maxStreak: 22,
    easySolved: 20,
    mediumSolved: 22,
    hardSolved: 12,
    score: 20 * 1 + 22 * 2 + 12 * 3,
    rank: 2,
    badges: [
      { id: "b4", type: "first_blood", title: "First Blood", description: "Solved your first problem", icon: "🩸", earnedAt: "2024-10-02" },
      { id: "b5", type: "on_a_roll", title: "On a Roll", description: "Maintained a 7-day streak", icon: "🔥", earnedAt: "2024-10-09" },
      { id: "b6", type: "paper_master", title: "Paper Master", description: "Solved 50 problems", icon: "📄", earnedAt: "2025-01-15" },
    ],
    submissions: [
      { id: "s6", problemSlug: "batch-normalization", problemTitle: "Batch Normalization", status: "passed", submittedAt: "2025-05-03" },
      { id: "s7", problemSlug: "dropout", problemTitle: "Dropout", status: "passed", submittedAt: "2025-05-02" },
    ],
    heatmapData: generateHeatmap(),
  },
  {
    id: "3",
    username: "loss_landscape",
    email: "loss@example.com",
    avatarUrl: "",
    joinDate: "2024-11-10",
    plan: "free",
    problemsSolved: 41,
    currentStreak: 3,
    maxStreak: 15,
    easySolved: 18,
    mediumSolved: 15,
    hardSolved: 8,
    score: 18 * 1 + 15 * 2 + 8 * 3,
    rank: 3,
    badges: [
      { id: "b7", type: "first_blood", title: "First Blood", description: "Solved your first problem", icon: "🩸", earnedAt: "2024-11-11" },
      { id: "b8", type: "on_a_roll", title: "On a Roll", description: "Maintained a 7-day streak", icon: "🔥", earnedAt: "2024-11-18" },
    ],
    submissions: [
      { id: "s8", problemSlug: "cross-entropy-loss", problemTitle: "Cross Entropy Loss", status: "passed", submittedAt: "2025-05-03" },
    ],
    heatmapData: generateHeatmap(),
  },
  {
    id: "4",
    username: "backprop_bob",
    email: "bob@example.com",
    avatarUrl: "",
    joinDate: "2024-12-05",
    plan: "free",
    problemsSolved: 33,
    currentStreak: 0,
    maxStreak: 10,
    easySolved: 15,
    mediumSolved: 12,
    hardSolved: 6,
    score: 15 * 1 + 12 * 2 + 6 * 3,
    rank: 4,
    badges: [
      { id: "b9", type: "first_blood", title: "First Blood", description: "Solved your first problem", icon: "🩸", earnedAt: "2024-12-06" },
      { id: "b10", type: "on_a_roll", title: "On a Roll", description: "Maintained a 7-day streak", icon: "🔥", earnedAt: "2024-12-13" },
    ],
    submissions: [],
    heatmapData: generateHeatmap(),
  },
  {
    id: "5",
    username: "tensor_flow_fan",
    email: "tf@example.com",
    avatarUrl: "",
    joinDate: "2025-01-20",
    plan: "free",
    problemsSolved: 28,
    currentStreak: 5,
    maxStreak: 8,
    easySolved: 14,
    mediumSolved: 10,
    hardSolved: 4,
    score: 14 * 1 + 10 * 2 + 4 * 3,
    rank: 5,
    badges: [
      { id: "b11", type: "first_blood", title: "First Blood", description: "Solved your first problem", icon: "🩸", earnedAt: "2025-01-21" },
      { id: "b12", type: "on_a_roll", title: "On a Roll", description: "Maintained a 7-day streak", icon: "🔥", earnedAt: "2025-01-28" },
    ],
    submissions: [],
    heatmapData: generateHeatmap(),
  },
  {
    id: "6", username: "relu_rebel", email: "relu@example.com", avatarUrl: "", joinDate: "2025-02-01", plan: "pro",
    problemsSolved: 22, currentStreak: 2, maxStreak: 12, easySolved: 10, mediumSolved: 8, hardSolved: 4,
    score: 10 + 16 + 12, rank: 6,
    badges: [{ id: "b13", type: "first_blood", title: "First Blood", description: "Solved your first problem", icon: "🩸", earnedAt: "2025-02-02" }],
    submissions: [], heatmapData: generateHeatmap(),
  },
  {
    id: "7", username: "softmax_sam", email: "sam@example.com", avatarUrl: "", joinDate: "2025-02-15", plan: "free",
    problemsSolved: 18, currentStreak: 1, maxStreak: 6, easySolved: 9, mediumSolved: 7, hardSolved: 2,
    score: 9 + 14 + 6, rank: 7,
    badges: [{ id: "b14", type: "first_blood", title: "First Blood", description: "Solved your first problem", icon: "🩸", earnedAt: "2025-02-16" }],
    submissions: [], heatmapData: generateHeatmap(),
  },
  {
    id: "8", username: "epoch_explorer", email: "epoch@example.com", avatarUrl: "", joinDate: "2025-03-01", plan: "free",
    problemsSolved: 12, currentStreak: 0, maxStreak: 4, easySolved: 7, mediumSolved: 4, hardSolved: 1,
    score: 7 + 8 + 3, rank: 8,
    badges: [{ id: "b15", type: "first_blood", title: "First Blood", description: "Solved your first problem", icon: "🩸", earnedAt: "2025-03-02" }],
    submissions: [], heatmapData: generateHeatmap(),
  },
  {
    id: "9", username: "kernel_kid", email: "kernel@example.com", avatarUrl: "", joinDate: "2025-03-20", plan: "free",
    problemsSolved: 8, currentStreak: 8, maxStreak: 8, easySolved: 5, mediumSolved: 3, hardSolved: 0,
    score: 5 + 6, rank: 9,
    badges: [{ id: "b16", type: "first_blood", title: "First Blood", description: "Solved your first problem", icon: "🩸", earnedAt: "2025-03-21" }],
    submissions: [], heatmapData: generateHeatmap(),
  },
  {
    id: "10", username: "weight_init_wiz", email: "wiz@example.com", avatarUrl: "", joinDate: "2025-04-01", plan: "free",
    problemsSolved: 4, currentStreak: 0, maxStreak: 3, easySolved: 3, mediumSolved: 1, hardSolved: 0,
    score: 3 + 2, rank: 10,
    badges: [{ id: "b17", type: "first_blood", title: "First Blood", description: "Solved your first problem", icon: "🩸", earnedAt: "2025-04-02" }],
    submissions: [], heatmapData: generateHeatmap(),
  },
];

export const currentUser = mockUsers[0];
