import { ml150Topics } from "./fundamentals-ml150";
import { numpyTopics } from "./fundamentals-numpy";
import { pandasTopics } from "./fundamentals-pandas";
import { pandasExtraTopics } from "./fundamentals-pandas-extra";
import { domainFundamentalsTopics } from "./fundamentals-domain";

export type Difficulty = "easy" | "medium" | "hard";

export interface FundTask {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  skeleton: string;
  tests: string;
  whyImplement?: string;
}

export interface FundTopic {
  slug: string;
  subject: string; // "ml150" | "numpy" | "pandas" | "biology" | "chemistry" | "electrical" | "electronics"
  title: string;
  year: number;
  authors: string[];
  category: string;
  description: string;
  realWorldUse?: string;
  systems?: string[];
  tasks: FundTask[];
}

export const difficultyConfig: Record<Difficulty, { label: string; color: string }> = {
  easy:   { label: "Easy",   color: "#22c55e" },
  medium: { label: "Medium", color: "#f59e0b" },
  hard:   { label: "Hard",   color: "#ef4444" },
};

export const allFundTopics: FundTopic[] = [
  ...ml150Topics,
  ...numpyTopics,
  ...pandasTopics,
  ...pandasExtraTopics,
  ...domainFundamentalsTopics,
];

export function getFundTopic(subject: string, slug: string): FundTopic | undefined {
  return allFundTopics.find((t) => t.subject === subject && t.slug === slug);
}

export function getFundTask(subject: string, slug: string, taskSlug: string) {
  const topic = getFundTopic(subject, slug);
  if (!topic) return undefined;
  const task = topic.tasks.find((t) => t.slug === taskSlug);
  if (!task) return undefined;
  return { topic, task };
}
