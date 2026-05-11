"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Paper } from "@/data/papers";
import {
  buildReaderCitations,
  getEmbeddablePaperUrl,
  getOriginalPaperUrl,
  makeInitialNotes,
  makeStarterQuestions,
  withPdfFragment,
  type ReaderCitation,
} from "@/lib/paperReader";

type ToolTab = "brief" | "annotations" | "projects" | "tables" | "notes";
type HighlightColor = "yellow" | "cyan" | "green" | "pink";

interface PaperSummary {
  slug: string;
  title: string;
  authors: string[];
  tags: string[];
  description: string;
  year: number;
}

interface SourceCitation extends ReaderCitation {
  paperSlug: string;
  paperTitle: string;
  sourceUrl?: string;
  kind: "overview" | "task" | "project" | "annotation" | "table";
}

interface Annotation {
  id: string;
  quote: string;
  note: string;
  color: HighlightColor;
  page: number;
  tags: string[];
  createdAt: string;
  citationId: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: SourceCitation[];
}

interface ResearchProject {
  id: string;
  name: string;
  paperSlugs: string[];
  artifact: string;
}

interface TableColumn {
  id: string;
  label: string;
}

interface TableRow {
  id: string;
  paperSlug: string;
  cells: Record<string, string>;
  citationIds: Record<string, string>;
}

interface ReaderStorage {
  annotations: Annotation[];
  notes: string;
  chatMessages: ChatMessage[];
  projects: ResearchProject[];
  activeProjectId: string;
  tableColumns: TableColumn[];
  tableRows: TableRow[];
}

interface OpenPaperReaderProps {
  paper: Paper;
  papers: PaperSummary[];
}

const DEFAULT_COLUMNS: TableColumn[] = [
  { id: "problem", label: "Problem" },
  { id: "method", label: "Method" },
  { id: "implementation", label: "Implementation" },
  { id: "evidence", label: "Evidence" },
];

const colorLabels: Record<HighlightColor, string> = {
  yellow: "Yellow",
  cyan: "Cyan",
  green: "Green",
  pink: "Pink",
};

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function makeDefaultProjects(paper: Paper, papers: PaperSummary[]): ResearchProject[] {
  const primaryTag = paper.tags[0];
  const related = papers
    .filter((item) => item.slug !== paper.slug && (primaryTag ? item.tags.includes(primaryTag) : true))
    .slice(0, 5)
    .map((item) => item.slug);

  return [
    {
      id: "current-paper",
      name: "Current paper",
      paperSlugs: [paper.slug],
      artifact: "",
    },
    {
      id: "related-set",
      name: primaryTag ? `${primaryTag} reading set` : "Related reading set",
      paperSlugs: [paper.slug, ...related],
      artifact: "",
    },
  ];
}

function makeSourceCitations(
  paper: Paper,
  papers: PaperSummary[],
  currentCitations: ReaderCitation[],
  annotations: Annotation[],
  project?: ResearchProject,
): SourceCitation[] {
  const sourceUrl = getOriginalPaperUrl(paper) ?? undefined;
  const base = currentCitations.map((citation, index) => ({
    ...citation,
    id: `C${index + 1}`,
    paperSlug: paper.slug,
    paperTitle: paper.title,
    sourceUrl,
    kind: index === 0 ? "overview" : "task",
  })) satisfies SourceCitation[];

  const annotationCitations = annotations.map((annotation, index) => ({
    id: `A${index + 1}`,
    label: `Annotation on page ${annotation.page}`,
    page: annotation.page,
    snippet: annotation.quote,
    paperSlug: paper.slug,
    paperTitle: paper.title,
    sourceUrl,
    kind: "annotation",
  })) satisfies SourceCitation[];

  const projectPaperSlugs = new Set(project?.paperSlugs ?? [paper.slug]);
  const projectCitations = papers
    .filter((item) => item.slug !== paper.slug && projectPaperSlugs.has(item.slug))
    .slice(0, 8)
    .map((item, index) => ({
      id: `P${index + 1}`,
      label: item.title,
      page: 1,
      snippet: item.description,
      paperSlug: item.slug,
      paperTitle: item.title,
      kind: "project",
    })) satisfies SourceCitation[];

  return [...base, ...annotationCitations, ...projectCitations];
}

function findPaperSummary(slug: string, currentPaper: Paper, papers: PaperSummary[]) {
  if (slug === currentPaper.slug) {
    return {
      slug: currentPaper.slug,
      title: currentPaper.title,
      authors: currentPaper.authors,
      tags: currentPaper.tags,
      description: currentPaper.description,
      year: currentPaper.year,
    };
  }

  return papers.find((item) => item.slug === slug);
}

function makeInitialChat(paper: Paper, citations: SourceCitation[]): ChatMessage[] {
  return [
    {
      id: "assistant-welcome",
      role: "assistant",
      content: `I am reading beside you. Ask about the paper, a highlighted passage, or the active project and I will answer with clickable citations like [C1] and [C2].`,
      citations: citations.slice(0, 2),
    },
  ];
}

function makeDefaultStorage(paper: Paper, papers: PaperSummary[], citations: SourceCitation[]): ReaderStorage {
  const projects = makeDefaultProjects(paper, papers);

  return {
    annotations: [],
    notes: makeInitialNotes(paper),
    chatMessages: makeInitialChat(paper, citations),
    projects,
    activeProjectId: projects[0].id,
    tableColumns: DEFAULT_COLUMNS,
    tableRows: [],
  };
}

function readStoredReaderStorage(
  storageKey: string,
  paper: Paper,
  papers: PaperSummary[],
  citations: SourceCitation[],
): ReaderStorage {
  const fallback = makeDefaultStorage(paper, papers, citations);
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw) as Partial<ReaderStorage>;
    const projects = Array.isArray(parsed.projects) && parsed.projects.length > 0 ? parsed.projects : fallback.projects;
    const activeProjectId = projects.some((project) => project.id === parsed.activeProjectId)
      ? parsed.activeProjectId ?? fallback.activeProjectId
      : projects[0].id;

    return {
      annotations: Array.isArray(parsed.annotations) ? parsed.annotations : fallback.annotations,
      notes: typeof parsed.notes === "string" ? parsed.notes : fallback.notes,
      chatMessages: Array.isArray(parsed.chatMessages) ? parsed.chatMessages : fallback.chatMessages,
      projects,
      activeProjectId,
      tableColumns: Array.isArray(parsed.tableColumns) && parsed.tableColumns.length > 0 ? parsed.tableColumns : fallback.tableColumns,
      tableRows: Array.isArray(parsed.tableRows) ? parsed.tableRows : fallback.tableRows,
    };
  } catch {
    return fallback;
  }
}

function renderCitedText(content: string, citations: SourceCitation[], onCitationClick: (citation: SourceCitation) => void) {
  return content.split(/(\[[A-Z]\d+\])/g).map((part, index) => {
    const match = part.match(/^\[([A-Z]\d+)\]$/);
    if (!match) return <span key={`${part}-${index}`}>{part}</span>;

    const citation = citations.find((item) => item.id === match[1]);
    if (!citation) return <span key={`${part}-${index}`}>{part}</span>;

    return (
      <button
        key={`${part}-${index}`}
        className="openpaper-inline-citation"
        onClick={() => onCitationClick(citation)}
        type="button"
        title={`${citation.paperTitle}: ${citation.label}`}
      >
        {part}
      </button>
    );
  });
}

function buildAnswer(
  prompt: string,
  paper: Paper,
  papers: PaperSummary[],
  activeProject: ResearchProject,
  citations: SourceCitation[],
  annotations: Annotation[],
): ChatMessage {
  const lower = prompt.toLowerCase();
  const projectPapers = activeProject.paperSlugs
    .map((slug) => findPaperSummary(slug, paper, papers))
    .filter((item): item is PaperSummary => Boolean(item));
  const projectCitations = citations.filter((citation) => citation.kind === "project").slice(0, 3);
  const taskCitations = citations.filter((citation) => citation.kind === "task").slice(0, 3);
  const annotationCitations = citations.filter((citation) => citation.kind === "annotation").slice(0, 2);

  let usedCitations: SourceCitation[] = [citations[0], ...taskCitations].filter(
    (citation): citation is SourceCitation => Boolean(citation),
  );

  let content = `${paper.title} is best read as a paper-plus-implementation workflow: start with the core claim [C1], then verify the details through the task citations ${taskCitations
    .slice(0, 2)
    .map((citation) => `[${citation.id}]`)
    .join(" ")}. `;

  if (lower.includes("project") || lower.includes("across") || lower.includes("multiple")) {
    usedCitations = [citations[0], ...projectCitations].filter((citation): citation is SourceCitation => Boolean(citation));
    content = `Across "${activeProject.name}", there are ${projectPapers.length} papers in scope. I would compare the current paper against ${projectPapers
      .filter((item) => item.slug !== paper.slug)
      .slice(0, 2)
      .map((item) => item.title)
      .join(" and ") || "the current paper's implementation track"} ${projectCitations
      .slice(0, 2)
      .map((citation) => `[${citation.id}]`)
      .join(" ")}. `;
  } else if (lower.includes("highlight") || lower.includes("annotation") || lower.includes("note")) {
    usedCitations = [citations[0], ...annotationCitations, ...taskCitations].filter(
      (citation): citation is SourceCitation => Boolean(citation),
    );
    content = annotations.length
      ? `Your saved highlights point to the passages you should discuss next. The strongest current annotation is grounded at ${annotationCitations[0] ? `[${annotationCitations[0].id}]` : "[C1]"}, and it connects back to the implementation path ${taskCitations[0] ? `[${taskCitations[0].id}]` : "[C2]"}. `
      : `You have not saved a highlight yet. Select text from the visible reader or paste a passage into Smart Annotations, then ask me to reason over it with citations [C1]. `;
  } else if (lower.includes("table") || lower.includes("extract") || lower.includes("schema")) {
    content = `For structured extraction, use the Data Tables tab to define fields, generate rows for "${activeProject.name}", and verify every cell against source citations [C1] ${taskCitations[0] ? `[${taskCitations[0].id}]` : ""}. `;
  }

  content += `For verification, click any citation chip; current-paper citations jump the reader to the cited page, while project citations show the source paper with a direct reader link.`;

  return {
    id: makeId("assistant"),
    role: "assistant",
    content,
    citations: Array.from(new Map(usedCitations.map((citation) => [citation.id, citation])).values()).slice(0, 5),
  };
}

function buildTableRows(
  project: ResearchProject,
  paper: Paper,
  papers: PaperSummary[],
  columns: TableColumn[],
  citations: SourceCitation[],
): TableRow[] {
  return project.paperSlugs
    .map((slug) => findPaperSummary(slug, paper, papers))
    .filter((item): item is PaperSummary => Boolean(item))
    .map((item, rowIndex) => {
      const currentPaper = item.slug === paper.slug;
      const citation = currentPaper ? citations[0] : citations.find((source) => source.paperSlug === item.slug) ?? citations[0];
      const task = paper.tasks[rowIndex % paper.tasks.length];
      const cells = Object.fromEntries(
        columns.map((column) => {
          const label = column.label.toLowerCase();
          if (label.includes("problem")) return [column.id, item.description.split(".")[0] || item.description];
          if (label.includes("method")) return [column.id, item.tags.slice(0, 3).join(", ") || "Paper methodology"];
          if (label.includes("implementation")) {
            return [column.id, currentPaper && task ? task.title : "Compare against current implementation track"];
          }
          if (label.includes("evidence")) return [column.id, citation ? `[${citation.id}] ${citation.label}` : "Source overview"];
          return [column.id, `${item.title}: ${column.label}`];
        }),
      );
      const citationIds = Object.fromEntries(columns.map((column) => [column.id, citation?.id ?? "C1"]));

      return {
        id: `${project.id}-${item.slug}`,
        paperSlug: item.slug,
        cells,
        citationIds,
      };
    });
}

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}

function downloadCsv(filename: string, columns: TableColumn[], rows: TableRow[]) {
  const header = ["Paper", ...columns.map((column) => column.label), "Citations"];
  const body = rows.map((row) => [
    row.paperSlug,
    ...columns.map((column) => row.cells[column.id] ?? ""),
    Object.values(row.citationIds).join(" "),
  ]);
  const csv = [header, ...body].map((line) => line.map(csvEscape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function MarkdownPreview({ value }: { value: string }) {
  return (
    <div className="openpaper-markdown-preview">
      {value.split("\n").map((line, index) => {
        if (line.startsWith("# ")) return <h1 key={index}>{line.slice(2)}</h1>;
        if (line.startsWith("## ")) return <h2 key={index}>{line.slice(3)}</h2>;
        if (line.startsWith("- [ ] ") || line.startsWith("- [x] ")) {
          const checked = line.startsWith("- [x] ");
          return (
            <label key={index} className="openpaper-note-check">
              <input type="checkbox" checked={checked} readOnly />
              <span>{line.slice(6)}</span>
            </label>
          );
        }
        if (line.startsWith("- ")) return <li key={index}>{line.slice(2)}</li>;
        if (!line.trim()) return <div key={index} className="openpaper-preview-space" />;
        return <p key={index}>{line}</p>;
      })}
    </div>
  );
}

export function OpenPaperReader({ paper, papers }: OpenPaperReaderProps) {
  const rawCurrentCitations = useMemo(() => buildReaderCitations(paper), [paper]);
  const starterQuestions = useMemo(() => makeStarterQuestions(paper), [paper]);
  const storageKey = `pullgame:openpaper-reader:${paper.slug}:v2`;
  const initialCitations = useMemo(
    () => makeSourceCitations(paper, papers, rawCurrentCitations, [], makeDefaultProjects(paper, papers)[0]),
    [paper, papers, rawCurrentCitations],
  );
  const [readerStorage, setReaderStorage] = useState<ReaderStorage>(() =>
    readStoredReaderStorage(storageKey, paper, papers, initialCitations),
  );
  const [activeTool, setActiveTool] = useState<ToolTab>("brief");
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [paperSearch, setPaperSearch] = useState("");
  const [frameKey, setFrameKey] = useState(0);
  const [question, setQuestion] = useState("");
  const [draftQuote, setDraftQuote] = useState("");
  const [draftNote, setDraftNote] = useState("");
  const [draftTags, setDraftTags] = useState("");
  const [draftPage, setDraftPage] = useState(1);
  const [draftColor, setDraftColor] = useState<HighlightColor>("yellow");
  const [newProjectName, setNewProjectName] = useState("");
  const [newColumnName, setNewColumnName] = useState("");
  const [notesMode, setNotesMode] = useState<"write" | "preview">("write");
  const [verifiedCitation, setVerifiedCitation] = useState<SourceCitation | null>(null);

  const originalUrl = getOriginalPaperUrl(paper);
  const embeddableUrl = getEmbeddablePaperUrl(paper);
  const viewerUrl = embeddableUrl ? withPdfFragment(embeddableUrl, page, zoom, paperSearch) : null;
  const activeProject = readerStorage.projects.find((project) => project.id === readerStorage.activeProjectId) ?? readerStorage.projects[0];
  const citations = useMemo(
    () => makeSourceCitations(paper, papers, rawCurrentCitations, readerStorage.annotations, activeProject),
    [activeProject, paper, papers, rawCurrentCitations, readerStorage.annotations],
  );
  const projectPapers = activeProject.paperSlugs
    .map((slug) => findPaperSummary(slug, paper, papers))
    .filter((item): item is PaperSummary => Boolean(item));

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(readerStorage));
  }, [readerStorage, storageKey]);

  const focusCitation = (citation: SourceCitation) => {
    setVerifiedCitation(citation);

    if (citation.paperSlug === paper.slug) {
      setPage(citation.page);
      setPaperSearch(citation.label);
      setFrameKey((key) => key + 1);
    }
  };

  const askQuestion = (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = { id: makeId("user"), role: "user", content: trimmed };
    const answer = buildAnswer(trimmed, paper, papers, activeProject, citations, readerStorage.annotations);

    setReaderStorage((current) => ({
      ...current,
      chatMessages: [...current.chatMessages, userMessage, answer],
    }));
    setQuestion("");
  };

  const handleAsk = (event: FormEvent) => {
    event.preventDefault();
    askQuestion(question);
  };

  const captureSelection = () => {
    const selected = window.getSelection()?.toString().trim() ?? "";
    if (selected) {
      setDraftQuote(selected);
      setActiveTool("annotations");
    }
  };

  const saveAnnotation = () => {
    const quote = draftQuote.trim();
    if (!quote) return;

    const annotation: Annotation = {
      id: makeId("annotation"),
      quote,
      note: draftNote.trim(),
      color: draftColor,
      page: Math.max(1, draftPage),
      tags: draftTags.split(",").map((tag) => tag.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      citationId: `A${readerStorage.annotations.length + 1}`,
    };

    setReaderStorage((current) => ({
      ...current,
      annotations: [annotation, ...current.annotations],
      chatMessages: [
        ...current.chatMessages,
        {
          id: makeId("assistant"),
          role: "assistant",
          content: `Saved the highlight. You can now ask about this passage and I will include it as an annotation citation [A1].`,
          citations: citations.filter((citation) => citation.id === "C1").slice(0, 1),
        },
      ],
    }));
    setDraftQuote("");
    setDraftNote("");
    setDraftTags("");
  };

  const toggleProjectPaper = (projectId: string, paperSlug: string) => {
    setReaderStorage((current) => ({
      ...current,
      projects: current.projects.map((project) => {
        if (project.id !== projectId) return project;
        const hasPaper = project.paperSlugs.includes(paperSlug);
        const paperSlugs = hasPaper
          ? project.paperSlugs.filter((slug) => slug !== paperSlug)
          : [...project.paperSlugs, paperSlug];
        return { ...project, paperSlugs: paperSlugs.length > 0 ? paperSlugs : [paper.slug] };
      }),
    }));
  };

  const createProject = () => {
    const name = newProjectName.trim();
    if (!name) return;

    const project: ResearchProject = {
      id: makeId("project"),
      name,
      paperSlugs: [paper.slug],
      artifact: "",
    };

    setReaderStorage((current) => ({
      ...current,
      projects: [...current.projects, project],
      activeProjectId: project.id,
    }));
    setNewProjectName("");
  };

  const generateArtifact = () => {
    const artifact = `# ${activeProject.name}

## Papers
${projectPapers.map((item, index) => `- ${item.title} [${item.slug === paper.slug ? "C1" : `P${index}`}]`).join("\n")}

## Cross-Paper Synthesis
This project is centered on ${paper.title}. Use the current paper as the implementation anchor, then compare its method and assumptions against the rest of the project set.

## Next Actions
- Verify the main claim in the paper reader.
- Ask a cross-paper question in the copilot.
- Generate a data table with evidence-backed cells.
`;

    setReaderStorage((current) => ({
      ...current,
      projects: current.projects.map((project) =>
        project.id === activeProject.id ? { ...project, artifact } : project,
      ),
    }));
  };

  const addColumn = () => {
    const label = newColumnName.trim();
    if (!label) return;
    setReaderStorage((current) => ({
      ...current,
      tableColumns: [...current.tableColumns, { id: makeId("column"), label }],
    }));
    setNewColumnName("");
  };

  const generateTable = () => {
    setReaderStorage((current) => ({
      ...current,
      tableRows: buildTableRows(activeProject, paper, papers, current.tableColumns, citations),
    }));
  };

  const insertCitationInNotes = (citation: SourceCitation) => {
    setReaderStorage((current) => ({
      ...current,
      notes: `${current.notes.trimEnd()}\n- ${citation.paperTitle}: ${citation.label} [${citation.id}]\n`,
    }));
    setActiveTool("notes");
  };

  return (
    <div className="openpaper-shell openpaper-shell-v2">
      <header className="openpaper-topbar openpaper-topbar-v2">
        <div className="openpaper-title-block">
          <Link href={`/papers/${paper.slug}`} className="openpaper-back-link">
            Back to paper
          </Link>
          <h1>{paper.title}</h1>
          <p>{paper.authors.join(", ")} / {paper.year}</p>
        </div>

        <div className="openpaper-top-actions">
          <div className="openpaper-sync-pill">
            <span />
            Synced in workspace
          </div>
          <button className="btn-secondary openpaper-action-button" type="button" onClick={captureSelection}>
            Capture selection
          </button>
          {originalUrl && (
            <a className="btn-primary openpaper-action-button" href={originalUrl} target="_blank" rel="noreferrer">
              Open original
            </a>
          )}
        </div>
      </header>

      <main className="openpaper-workspace openpaper-workspace-v2">
        <section className="openpaper-paper-pane" aria-label="Original paper">
          <div className="openpaper-viewer-toolbar openpaper-viewer-toolbar-v2">
            <div className="openpaper-toolbar-group">
              <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))}>
                Prev
              </button>
              <label>
                Page
                <input
                  type="number"
                  min={1}
                  value={page}
                  onChange={(event) => setPage(Math.max(1, Number(event.target.value) || 1))}
                />
              </label>
              <button type="button" onClick={() => setPage((value) => value + 1)}>
                Next
              </button>
            </div>

            <div className="openpaper-toolbar-group">
              <button type="button" onClick={() => setZoom((value) => Math.max(50, value - 10))}>
                -
              </button>
              <span>{zoom}%</span>
              <button type="button" onClick={() => setZoom((value) => Math.min(200, value + 10))}>
                +
              </button>
            </div>

            <form
              className="openpaper-paper-search"
              onSubmit={(event) => {
                event.preventDefault();
                setFrameKey((key) => key + 1);
              }}
            >
              <input
                value={paperSearch}
                onChange={(event) => setPaperSearch(event.target.value)}
                placeholder="Find in paper"
              />
              <button type="submit">Find</button>
            </form>
          </div>

          <div className="openpaper-frame-wrap">
            {viewerUrl ? (
              <iframe
                key={`${frameKey}-${viewerUrl}`}
                className="openpaper-frame"
                src={viewerUrl}
                title={`Original paper for ${paper.title}`}
              />
            ) : (
              <div className="openpaper-empty-source">
                <h2>No original source configured</h2>
                <p>The copilot, annotations, projects, notes, and data tables still work from the paper metadata.</p>
              </div>
            )}
          </div>
        </section>

        <aside className="openpaper-copilot" aria-label="Research copilot">
          <section className="openpaper-copilot-main">
            <div className="openpaper-copilot-header">
              <div>
                <span>AI Copilot</span>
                <strong>{activeProject.name}</strong>
              </div>
              <button type="button" onClick={() => askQuestion("Summarize the active project with citations")}>
                Ask project
              </button>
            </div>

            <div className="openpaper-source-strip">
              {citations.slice(0, 11).map((citation) => (
                <button
                  key={citation.id}
                  type="button"
                  className={verifiedCitation?.id === citation.id ? "active" : ""}
                  onClick={() => focusCitation(citation)}
                >
                  <strong>[{citation.id}]</strong>
                  <span>{citation.label}</span>
                </button>
              ))}
            </div>

            {verifiedCitation && (
              <div className="openpaper-verification">
                <div>
                  <strong>[{verifiedCitation.id}] {verifiedCitation.label}</strong>
                  <span>{verifiedCitation.paperTitle} / page {verifiedCitation.page}</span>
                </div>
                <p>{verifiedCitation.snippet.slice(0, 180)}</p>
                <div>
                  <button type="button" onClick={() => insertCitationInNotes(verifiedCitation)}>
                    Add to notes
                  </button>
                  {verifiedCitation.paperSlug !== paper.slug && (
                    <Link href={`/papers/${verifiedCitation.paperSlug}/reader`}>Open paper</Link>
                  )}
                </div>
              </div>
            )}

            <div className="openpaper-chat-log openpaper-chat-log-v2">
              {readerStorage.chatMessages.map((message) => (
                <article key={message.id} className={`openpaper-message ${message.role}`}>
                  <div className="openpaper-message-role">{message.role === "user" ? "You" : "AI"}</div>
                  <p>{renderCitedText(message.content, message.citations ?? citations, focusCitation)}</p>
                  {message.citations && message.citations.length > 0 && (
                    <div className="openpaper-citation-list compact">
                      {message.citations.map((citation) => (
                        <button key={citation.id} type="button" onClick={() => focusCitation(citation)}>
                          <strong>[{citation.id}] {citation.label}</strong>
                          <span>{citation.snippet.slice(0, 110)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>

            <form className="openpaper-chat-form openpaper-chat-form-v2" onSubmit={handleAsk}>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask about this paper, your highlights, or the active project"
                rows={3}
              />
              <div>
                <button type="submit" className="btn-primary">
                  Ask with citations
                </button>
                <button type="button" className="btn-secondary" onClick={() => askQuestion(starterQuestions[1] ?? starterQuestions[0])}>
                  Starter
                </button>
              </div>
            </form>
          </section>

          <section className="openpaper-console">
            <div className="openpaper-tabs openpaper-tabs-v2">
              {(["brief", "annotations", "projects", "tables", "notes"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={activeTool === tab ? "active" : ""}
                  onClick={() => setActiveTool(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="openpaper-console-body">
              {activeTool === "brief" && (
                <div className="openpaper-brief openpaper-brief-v2">
                  <section>
                    <h2>Grounded Brief</h2>
                    <p>{paper.description} {renderCitedText("[C1]", citations, focusCitation)}</p>
                  </section>
                  <section>
                    <h3>Reading Flow</h3>
                    <ol>
                      {paper.tasks.slice(0, 10).map((task, index) => (
                        <li key={task.slug}>
                          <Link href={`/papers/${paper.slug}/problems/${task.slug}`}>{task.title}</Link>
                          <span>{renderCitedText(` [C${index + 2}]`, citations, focusCitation)}</span>
                        </li>
                      ))}
                    </ol>
                  </section>
                  <section>
                    <h3>Starter Questions</h3>
                    <div className="openpaper-question-list">
                      {starterQuestions.map((starter) => (
                        <button key={starter} type="button" onClick={() => askQuestion(starter)}>
                          {starter}
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {activeTool === "annotations" && (
                <div className="openpaper-annotations openpaper-annotations-v2">
                  <section className="openpaper-annotation-editor">
                    <div className="openpaper-editor-row">
                      <label>
                        Page
                        <input
                          type="number"
                          min={1}
                          value={draftPage}
                          onChange={(event) => setDraftPage(Math.max(1, Number(event.target.value) || 1))}
                        />
                      </label>
                      <div className="openpaper-color-row">
                        {(Object.keys(colorLabels) as HighlightColor[]).map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`openpaper-color ${color} ${draftColor === color ? "active" : ""}`}
                            onClick={() => setDraftColor(color)}
                            aria-label={colorLabels[color]}
                            title={colorLabels[color]}
                          />
                        ))}
                      </div>
                    </div>
                    <textarea
                      value={draftQuote}
                      onChange={(event) => setDraftQuote(event.target.value)}
                      placeholder="Paste selected text or use Capture selection"
                      rows={4}
                    />
                    <textarea
                      value={draftNote}
                      onChange={(event) => setDraftNote(event.target.value)}
                      placeholder="Annotation note"
                      rows={3}
                    />
                    <input value={draftTags} onChange={(event) => setDraftTags(event.target.value)} placeholder="Tags, comma separated" />
                    <button type="button" className="btn-primary" onClick={saveAnnotation}>
                      Save highlight
                    </button>
                  </section>

                  <section className="openpaper-saved-annotations">
                    {readerStorage.annotations.length === 0 ? (
                      <p className="openpaper-muted">No highlights yet. Save one, then ask the copilot about it.</p>
                    ) : (
                      readerStorage.annotations.map((annotation, index) => (
                        <article key={annotation.id} className={`openpaper-annotation ${annotation.color}`}>
                          <div>
                            <button
                              type="button"
                              onClick={() =>
                                focusCitation({
                                  id: `A${index + 1}`,
                                  label: `Annotation on page ${annotation.page}`,
                                  page: annotation.page,
                                  snippet: annotation.quote,
                                  paperSlug: paper.slug,
                                  paperTitle: paper.title,
                                  sourceUrl: originalUrl ?? undefined,
                                  kind: "annotation",
                                })
                              }
                            >
                              [A{index + 1}] Page {annotation.page}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setReaderStorage((current) => ({
                                  ...current,
                                  annotations: current.annotations.filter((item) => item.id !== annotation.id),
                                }))
                              }
                            >
                              Delete
                            </button>
                          </div>
                          <blockquote>{annotation.quote}</blockquote>
                          {annotation.note && <p>{annotation.note}</p>}
                          {annotation.tags.length > 0 && (
                            <footer>{annotation.tags.map((tag) => <span key={tag}>{tag}</span>)}</footer>
                          )}
                        </article>
                      ))
                    )}
                  </section>
                </div>
              )}

              {activeTool === "projects" && (
                <div className="openpaper-projects">
                  <div className="openpaper-project-create">
                    <input value={newProjectName} onChange={(event) => setNewProjectName(event.target.value)} placeholder="New project name" />
                    <button type="button" onClick={createProject}>Create</button>
                  </div>

                  <div className="openpaper-project-grid">
                    {readerStorage.projects.map((project) => (
                      <button
                        type="button"
                        key={project.id}
                        className={project.id === activeProject.id ? "active" : ""}
                        onClick={() => setReaderStorage((current) => ({ ...current, activeProjectId: project.id }))}
                      >
                        <strong>{project.name}</strong>
                        <span>{project.paperSlugs.length} papers</span>
                      </button>
                    ))}
                  </div>

                  <div className="openpaper-project-papers">
                    {papers.slice(0, 18).map((item) => (
                      <label key={item.slug}>
                        <input
                          type="checkbox"
                          checked={activeProject.paperSlugs.includes(item.slug)}
                          onChange={() => toggleProjectPaper(activeProject.id, item.slug)}
                        />
                        <span>{item.title}</span>
                      </label>
                    ))}
                  </div>

                  <div className="openpaper-artifact-actions">
                    <button type="button" className="btn-primary" onClick={generateArtifact}>
                      Generate artifact
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => askQuestion("What connects the papers in this project?")}>
                      Cross-paper chat
                    </button>
                  </div>

                  {activeProject.artifact && (
                    <pre className="openpaper-artifact">{activeProject.artifact}</pre>
                  )}
                </div>
              )}

              {activeTool === "tables" && (
                <div className="openpaper-data-tables">
                  <div className="openpaper-table-builder">
                    <div>
                      {readerStorage.tableColumns.map((column) => (
                        <span key={column.id}>
                          {column.label}
                          <button
                            type="button"
                            onClick={() =>
                              setReaderStorage((current) => ({
                                ...current,
                                tableColumns: current.tableColumns.filter((item) => item.id !== column.id),
                              }))
                            }
                          >
                            x
                          </button>
                        </span>
                      ))}
                    </div>
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        addColumn();
                      }}
                    >
                      <input value={newColumnName} onChange={(event) => setNewColumnName(event.target.value)} placeholder="Add schema field" />
                      <button type="submit">Add</button>
                    </form>
                  </div>

                  <div className="openpaper-table-actions">
                    <button type="button" className="btn-primary" onClick={generateTable}>
                      Extract table
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => downloadCsv(`${activeProject.name.toLowerCase().replaceAll(" ", "-")}.csv`, readerStorage.tableColumns, readerStorage.tableRows)}
                      disabled={readerStorage.tableRows.length === 0}
                    >
                      Export CSV
                    </button>
                  </div>

                  <div className="openpaper-table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Paper</th>
                          {readerStorage.tableColumns.map((column) => <th key={column.id}>{column.label}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {readerStorage.tableRows.length === 0 ? (
                          <tr>
                            <td colSpan={readerStorage.tableColumns.length + 1}>No extracted rows yet.</td>
                          </tr>
                        ) : (
                          readerStorage.tableRows.map((row) => (
                            <tr key={row.id}>
                              <td>{row.paperSlug}</td>
                              {readerStorage.tableColumns.map((column) => {
                                const citation = citations.find((item) => item.id === row.citationIds[column.id]);
                                return (
                                  <td key={column.id}>
                                    <span>{row.cells[column.id]}</span>
                                    {citation && (
                                      <button type="button" onClick={() => focusCitation(citation)}>
                                        [{citation.id}]
                                      </button>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTool === "notes" && (
                <div className="openpaper-notes openpaper-notes-v2">
                  <div className="openpaper-notes-toggle">
                    <button type="button" className={notesMode === "write" ? "active" : ""} onClick={() => setNotesMode("write")}>
                      Write
                    </button>
                    <button type="button" className={notesMode === "preview" ? "active" : ""} onClick={() => setNotesMode("preview")}>
                      Preview
                    </button>
                  </div>
                  {notesMode === "write" ? (
                    <textarea
                      value={readerStorage.notes}
                      onChange={(event) =>
                        setReaderStorage((current) => ({
                          ...current,
                          notes: event.target.value,
                        }))
                      }
                    />
                  ) : (
                    <MarkdownPreview value={readerStorage.notes} />
                  )}
                </div>
              )}
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
