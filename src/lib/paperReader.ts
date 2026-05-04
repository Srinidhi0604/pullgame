import type { Paper } from "@/data/papers";

export interface ReaderCitation {
  id: string;
  label: string;
  page: number;
  snippet: string;
  taskSlug?: string;
}

export function getOriginalPaperUrl(paper: Pick<Paper, "sourceUrl">): string | null {
  return paper.sourceUrl ?? null;
}

export function getEmbeddablePaperUrl(paper: Pick<Paper, "sourceUrl">): string | null {
  if (!paper.sourceUrl) return null;

  if (paper.sourceUrl.includes("arxiv.org/abs/")) {
    return paper.sourceUrl.replace("arxiv.org/abs/", "arxiv.org/pdf/");
  }

  return paper.sourceUrl;
}

export function withPdfFragment(url: string, page: number, zoom: number, search: string): string {
  const cleanUrl = url.split("#")[0];
  const fragment = [`page=${Math.max(1, page)}`, `zoom=${Math.max(50, Math.min(200, zoom))}`];
  const trimmedSearch = search.trim();

  if (trimmedSearch) {
    fragment.push(`search=${encodeURIComponent(trimmedSearch)}`);
  }

  return `${cleanUrl}#${fragment.join("&")}`;
}

export function buildReaderCitations(paper: Paper): ReaderCitation[] {
  const overview = {
    id: "C1",
    label: "Paper overview",
    page: 1,
    snippet: paper.description,
  };

  const tasks = paper.tasks.slice(0, 5).map((task, index) => ({
    id: `C${index + 2}`,
    label: task.title,
    page: index + 2,
    snippet: task.description.split("\n").find((line) => line.trim() && !line.startsWith("#")) ?? task.description,
    taskSlug: task.slug,
  }));

  return [overview, ...tasks];
}

export function makeStarterQuestions(paper: Paper): string[] {
  const firstTask = paper.tasks[0]?.title ?? "the first implementation task";
  const secondTask = paper.tasks[1]?.title ?? "the next implementation task";
  const tag = paper.tags[0] ?? "the core idea";

  return [
    `What problem does ${paper.title} solve?`,
    `Which parts of the paper should I understand before implementing ${firstTask}?`,
    `How does ${tag} connect to ${secondTask}?`,
    "Summarize the implementation track with citations.",
  ];
}

export function makeInitialNotes(paper: Paper): string {
  const tasks = paper.tasks.slice(0, 5).map((task) => `- [ ] ${task.title}`).join("\n");

  return `# ${paper.title}

## Reading Notes


## Key Citations


## Implementation Tasks
${tasks}
`;
}
