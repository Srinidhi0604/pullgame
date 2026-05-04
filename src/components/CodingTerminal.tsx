"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface CodingTerminalProps {
  title: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  skeleton: string;
  tests: string;
  backHref: string;
}

const diffLabels = { easy: "Easy", medium: "Medium", hard: "Hard" };

export function CodingTerminal({
  title,
  difficulty,
  description,
  skeleton,
  tests,
  backHref,
}: CodingTerminalProps) {
  const [code, setCode] = useState(skeleton);
  const [activeTab, setActiveTab] = useState<"description" | "output">("description");
  const [output, setOutput] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "running" | "passed" | "failed">("idle");
  const [leftWidth, setLeftWidth] = useState(45);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumberRef = useRef<HTMLDivElement>(null);

  // Sync scroll between textarea and line numbers
  const handleEditorScroll = useCallback(() => {
    if (textareaRef.current && lineNumberRef.current) {
      lineNumberRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  // Line count
  const lineCount = code.split("\n").length;

  // Handle tab key in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  // Resizer logic
  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftWidth(Math.max(25, Math.min(75, pct)));
    };

    const handleMouseUp = () => setIsResizing(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // Run tests (simulated)
  const handleRun = () => {
    setStatus("running");
    setOutput(null);
    setActiveTab("output");

    setTimeout(() => {
      // Check if user has written any code beyond the skeleton
      const hasImplementation =
        !code.includes("raise NotImplementedError") &&
        !code.includes("# YOUR CODE HERE") &&
        code.trim() !== skeleton.trim();

      if (hasImplementation) {
        setStatus("passed");
        setOutput(
          "✓ All tests passed!\n\n" +
          "  test_shape_check ............... PASSED  (0.12s)\n" +
          "  test_value_check ............... PASSED  (0.08s)\n" +
          "  test_edge_cases ................ PASSED  (0.15s)\n\n" +
          "  ─────────────────────────────────────────\n" +
          "  3 passed in 0.35s"
        );
      } else {
        setStatus("failed");
        setOutput(
          "✗ Tests failed\n\n" +
          "  test_shape_check ............... FAILED  (0.04s)\n\n" +
          "  NotImplementedError: \n" +
          "  Your function has not been implemented yet.\n" +
          "  Replace `raise NotImplementedError` with your solution.\n\n" +
          "  ─────────────────────────────────────────\n" +
          "  0 passed, 1 failed in 0.04s"
        );
      }
    }, 2000);
  };

  const handleSubmit = () => {
    handleRun();
  };

  const handleReset = () => {
    setCode(skeleton);
    setOutput(null);
    setStatus("idle");
    setActiveTab("description");
  };

  // Parse markdown description into simple rendered HTML
  const renderDescription = (md: string) => {
    const lines = md.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} style={{ paddingLeft: 20, margin: "8px 0" }}>
            {listItems.map((item, i) => (
              <li key={i} style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: 4 }}>
                {item}
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <pre
              key={`code-${elements.length}`}
              style={{
                background: "rgba(0,0,0,0.4)",
                border: "1px solid var(--glass-border)",
                borderRadius: 8,
                padding: 16,
                margin: "12px 0",
                overflowX: "auto",
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: 13,
                lineHeight: 1.5,
                color: "#e2e8f0",
              }}
            >
              <code>{codeBlockContent.join("\n")}</code>
            </pre>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          flushList();
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }

      // Headers
      if (line.startsWith("# ")) {
        flushList();
        continue; // Skip h1, we show title separately
      }
      if (line.startsWith("## ")) {
        flushList();
        elements.push(
          <h2
            key={`h2-${elements.length}`}
            style={{
              fontSize: 18,
              fontWeight: 700,
              margin: "28px 0 12px",
              color: "var(--text-primary)",
            }}
          >
            {line.replace("## ", "")}
          </h2>
        );
        continue;
      }
      if (line.startsWith("### ")) {
        flushList();
        elements.push(
          <h3
            key={`h3-${elements.length}`}
            style={{
              fontSize: 15,
              fontWeight: 600,
              margin: "20px 0 8px",
              color: "var(--text-primary)",
            }}
          >
            {line.replace("### ", "")}
          </h3>
        );
        continue;
      }

      // List items
      if (/^[\-\*]\s/.test(line) || /^\d+\.\s/.test(line)) {
        const content = line.replace(/^[\-\*]\s/, "").replace(/^\d+\.\s/, "");
        listItems.push(content);
        continue;
      }

      // Empty line
      if (line.trim() === "") {
        flushList();
        continue;
      }

      // Paragraph
      flushList();
      // Inline code
      const rendered = line.split(/(`[^`]+`)/).map((part, j) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={j}
              style={{
                background: "rgba(255,255,255,0.06)",
                padding: "2px 6px",
                borderRadius: 4,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                color: "var(--accent-cyan)",
              }}
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        // Bold
        return part.split(/(\*\*[^*]+\*\*)/).map((sub, k) => {
          if (sub.startsWith("**") && sub.endsWith("**")) {
            return <strong key={`${j}-${k}`}>{sub.slice(2, -2)}</strong>;
          }
          return sub;
        });
      });

      elements.push(
        <p
          key={`p-${elements.length}`}
          style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", margin: "8px 0" }}
        >
          {rendered}
        </p>
      );
    }
    flushList();
    return elements;
  };

  return (
    <div ref={containerRef} className="coding-terminal" style={{ userSelect: isResizing ? "none" : "auto" }}>
      {/* ===== LEFT PANEL ===== */}
      <div className="coding-terminal-left" style={{ flex: `0 0 ${leftWidth}%` }}>
        {/* Left Top Bar */}
        <div className="coding-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a
              href={backHref}
              style={{
                color: "var(--text-muted)",
                textDecoration: "none",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
              }}
            >
              ←
            </a>
            <span style={{ fontWeight: 700, fontSize: 15, color: "var(--accent-cyan)" }}>
              {title}
            </span>
            <span
              className={`badge-${difficulty}`}
              style={{ padding: "2px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}
            >
              {diffLabels[difficulty]}
            </span>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4 }}>
            <button
              className={`coding-tab ${activeTab === "description" ? "coding-tab-active" : ""}`}
              onClick={() => setActiveTab("description")}
            >
              📄 Description
            </button>
            <button
              className={`coding-tab ${activeTab === "output" ? "coding-tab-active" : ""}`}
              onClick={() => setActiveTab("output")}
            >
              📤 Output
              {status === "passed" && (
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-green)", display: "inline-block" }} />
              )}
              {status === "failed" && (
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-red)", display: "inline-block" }} />
              )}
            </button>
          </div>
        </div>

        {/* Left Content */}
        {activeTab === "description" ? (
          <div className="description-panel">
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                marginBottom: 4,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </h1>
            {renderDescription(description)}
          </div>
        ) : (
          <div style={{ padding: 24 }}>
            {output ? (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 16,
                    padding: "12px 16px",
                    borderRadius: 8,
                    background:
                      status === "passed"
                        ? "rgba(16, 185, 129, 0.08)"
                        : "rgba(239, 68, 68, 0.08)",
                    border: `1px solid ${
                      status === "passed"
                        ? "rgba(16, 185, 129, 0.2)"
                        : "rgba(239, 68, 68, 0.2)"
                    }`,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background:
                        status === "passed" ? "var(--accent-green)" : "var(--accent-red)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color:
                        status === "passed" ? "var(--accent-green)" : "var(--accent-red)",
                    }}
                  >
                    {status === "passed" ? "All Tests Passed" : "Tests Failed"}
                  </span>
                </div>
                <pre
                  style={{
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    fontSize: 13,
                    lineHeight: 1.7,
                    color: "var(--text-secondary)",
                    whiteSpace: "pre-wrap",
                    margin: 0,
                    background: "rgba(0,0,0,0.2)",
                    padding: 16,
                    borderRadius: 8,
                    border: "1px solid var(--glass-border)",
                  }}
                >
                  {output}
                </pre>
              </div>
            ) : status === "running" ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "60px 0",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    border: "3px solid rgba(255,255,255,0.1)",
                    borderTopColor: "var(--accent-cyan)",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
                  Running tests...
                </span>
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  color: "var(--text-muted)",
                }}
              >
                <p style={{ fontSize: 14 }}>Run your code to see output here</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===== RESIZER ===== */}
      <div
        className={`resizer ${isResizing ? "active" : ""}`}
        onMouseDown={startResize}
      />

      {/* ===== RIGHT PANEL ===== */}
      <div className="coding-terminal-right">
        {/* Right Top Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(13, 17, 23, 0.95)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>
              solution.py
            </span>
            <span
              style={{
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 4,
                background: "rgba(168, 85, 247, 0.15)",
                color: "var(--accent-purple)",
                fontWeight: 600,
              }}
            >
              Python
            </span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleReset}
              style={{
                padding: "5px 12px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "var(--text-secondary)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              ↺ Reset
            </button>
            <button
              className="btn-run"
              onClick={handleRun}
              disabled={status === "running"}
              style={{ opacity: status === "running" ? 0.6 : 1 }}
            >
              {status === "running" ? (
                <>
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      border: "2px solid rgba(255,255,255,0.2)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Running...
                </>
              ) : (
                <>▶ Run</>
              )}
            </button>
            <button className="btn-submit" onClick={handleSubmit} disabled={status === "running"}>
              ✓ Submit
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Line Numbers */}
          <div
            ref={lineNumberRef}
            style={{
              padding: "16px 12px 16px 16px",
              minWidth: 52,
              textAlign: "right",
              userSelect: "none",
              color: "rgba(148, 163, 184, 0.4)",
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: 13,
              lineHeight: "1.6",
              borderRight: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden",
              background: "rgba(0,0,0,0.15)",
            }}
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i + 1}>{i + 1}</div>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            className="code-editor-textarea"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onScroll={handleEditorScroll}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
        </div>

        {/* Bottom Output Bar (compact) */}
        {output && (
          <div className="output-panel">
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: status === "passed" ? "var(--accent-green)" : "var(--accent-red)",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: status === "passed" ? "var(--accent-green)" : "var(--accent-red)",
                }}
              >
                {status === "passed" ? "PASSED" : "FAILED"}
              </span>
            </div>
            <pre
              style={{
                margin: 0,
                color: "var(--text-muted)",
                whiteSpace: "pre-wrap",
                fontSize: 11,
                lineHeight: 1.5,
              }}
            >
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
