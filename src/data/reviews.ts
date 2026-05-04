export interface Review {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  rating: number;
  text: string;
  isApproved: boolean;
  createdAt: string;
}

export const mockReviews: Review[] = [
  {
    id: "r1",
    userId: "1",
    username: "arxiv_ninja",
    avatarUrl: "",
    rating: 5,
    text: "PullGame completely changed how I study ML papers. Instead of just reading about attention mechanisms, I actually implemented them from scratch. The test-driven approach ensures you truly understand the math.",
    isApproved: true,
    createdAt: "2025-04-28",
  },
  {
    id: "r2",
    userId: "2",
    username: "gradient_queen",
    avatarUrl: "",
    rating: 5,
    text: "The best platform for hands-on ML learning. Each problem is carefully crafted to teach you the core concept from the paper. The difficulty progression is perfect — start with easy problems like dropout, work up to full transformer blocks.",
    isApproved: true,
    createdAt: "2025-04-25",
  },
  {
    id: "r3",
    userId: "3",
    username: "loss_landscape",
    avatarUrl: "",
    rating: 4,
    text: "Great concept and execution. The leaderboard keeps me motivated, and the streak system pushes me to practice daily. Would love to see more problems from recent papers like Mamba and State Space Models.",
    isApproved: true,
    createdAt: "2025-04-20",
  },
  {
    id: "r4",
    userId: "4",
    username: "backprop_bob",
    avatarUrl: "",
    rating: 4,
    text: "Finally, a LeetCode-style platform but for ML! The problems are well-designed and the skeleton code gives you just enough structure. Implementing backprop from scratch was an enlightening experience.",
    isApproved: true,
    createdAt: "2025-04-15",
  },
  {
    id: "r5",
    userId: "5",
    username: "tensor_flow_fan",
    avatarUrl: "",
    rating: 5,
    text: "I recommend PullGame to all my ML study group members. The badge system is fun and the heatmap on the profile page gives me GitHub-contribution-level satisfaction. Implementing Adam optimizer was surprisingly tricky!",
    isApproved: true,
    createdAt: "2025-04-10",
  },
  {
    id: "r6",
    userId: "6",
    username: "relu_rebel",
    avatarUrl: "",
    rating: 5,
    text: "This is what ML education should look like. Theory meets practice in the most elegant way. Each problem description explains the paper concept beautifully before asking you to implement it.",
    isApproved: true,
    createdAt: "2025-04-05",
  },
];
