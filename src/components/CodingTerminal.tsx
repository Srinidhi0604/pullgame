"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  lazy,
  Suspense,
} from "react";
import { usePyodide } from "@/lib/usePyodide";

const MonacoEditor = lazy(() => import("@monaco-editor/react"));

interface CodingTerminalProps {
  title: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  skeleton: string;
  tests: string;
  backHref: string;
}

interface TestResult {
  name: string;
  status: "passed" | "failed";
  timeMs: number;
  output: string;
  error: string | null;
}

interface RunOutput {
  kind: "plain" | "tests";
  // for plain run
  stdout?: string;
  stderr?: string;
  error?: string | null;
  // for test run
  testResults?: TestResult[];
  totalPassed?: number;
  totalFailed?: number;
  totalMs?: number;
  isSample?: boolean; // true when only first test was run
}

const diffLabels = { easy: "Easy", medium: "Medium", hard: "Hard" };
const diffColors = { easy: "#10b981", medium: "#f59e0b", hard: "#ef4444" };

// Python code injected to run tests and emit structured JSON
const TEST_RUNNER_SUFFIX = `
import json as _json, traceback as _tb, time as _time, sys as _sys, io as _io

_test_results = []
_test_fns = [(n, f) for n, f in list(globals().items()) if n.startswith("test_") and callable(f)]

for _tname, _tfn in _test_fns:
    _t0 = _time.time()
    _buf = _io.StringIO()
    _old = _sys.stdout
    _sys.stdout = _buf
    try:
        _tfn()
        _sys.stdout = _old
        _test_results.append({"name": _tname, "status": "passed", "timeMs": round((_time.time()-_t0)*1000,1), "output": _buf.getvalue(), "error": None})
    except Exception:
        _sys.stdout = _old
        _test_results.append({"name": _tname, "status": "failed", "timeMs": round((_time.time()-_t0)*1000,1), "output": _buf.getvalue(), "error": _tb.format_exc()})

print("__TEST_JSON__:" + _json.dumps(_test_results))
`;

export function CodingTerminal({
  title,
  difficulty,
  description,
  skeleton,
  tests,
  backHref,
  taskSlug,
}: CodingTerminalProps & { taskSlug?: string }) {
  const [code, setCode] = useState(skeleton);
  const [activeLeftTab, setActiveLeftTab] = useState<"description" | "output">(
    "description",
  );
  const [activeRightTab, setActiveRightTab] = useState<"solution" | "tests">(
    "solution",
  );
  const [runStatus, setRunStatus] = useState<
    "idle" | "running" | "passed" | "failed"
  >("idle");
  const [output, setOutput] = useState<RunOutput | null>(null);
  const [runKey, setRunKey] = useState(0); // incremented on each run to force re-mount of output
  const [leftWidth, setLeftWidth] = useState(43);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { status: pyStatus, runCode } = usePyodide();

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;
    const move = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      setLeftWidth(
        Math.max(25, Math.min(70, ((e.clientX - r.left) / r.width) * 100)),
      );
    };
    const up = () => setIsResizing(false);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
  }, [isResizing]);

  // ── Run (execute code + first test case only) ──
  const handleRun = async () => {
    setActiveLeftTab("output");
    setRunKey((k) => k + 1); // force output panel re-mount
    setOutput(null);
    if (pyStatus !== "ready") {
      setOutput({
        kind: "plain",
        stdout: "",
        stderr: "",
        error: "⏳ Python is still loading...",
      });
      return;
    }
    setRunStatus("running");

    // Build a runner that picks only the FIRST test_ function
    const singleTestRunner = `
import json as _json, traceback as _tb, time as _time, sys as _sys, io as _io

_test_results = []
_test_fns = [(n, f) for n, f in list(globals().items()) if n.startswith("test_") and callable(f)]

# Run only the first test case for "Run"
if _test_fns:
    _tname, _tfn = _test_fns[0]
    _t0 = _time.time()
    _buf = _io.StringIO()
    _old = _sys.stdout
    _sys.stdout = _buf
    try:
        _tfn()
        _sys.stdout = _old
        _test_results.append({"name": _tname, "status": "passed", "timeMs": round((_time.time()-_t0)*1000,1), "output": _buf.getvalue(), "error": None})
    except Exception:
        _sys.stdout = _old
        _test_results.append({"name": _tname, "status": "failed", "timeMs": round((_time.time()-_t0)*1000,1), "output": _buf.getvalue(), "error": _tb.format_exc()})

print("__TEST_JSON__:" + _json.dumps(_test_results))
`;

    const codeToRun = `${code}\n\n${tests}\n\n${singleTestRunner}`;
    const result = await runCode(codeToRun);

    const marker = "__TEST_JSON__:";
    const markerIdx = (result.stdout ?? "").indexOf(marker);
    if (markerIdx !== -1) {
      try {
        const json = result
          .stdout!.slice(markerIdx + marker.length)
          .split("\n")[0];
        const testResults: TestResult[] = JSON.parse(json);
        const passed = testResults.filter((t) => t.status === "passed").length;
        const failed = testResults.filter((t) => t.status === "failed").length;
        const totalMs = testResults.reduce((s, t) => s + t.timeMs, 0);
        setRunStatus(failed > 0 ? "failed" : "passed");
        setOutput({
          kind: "tests",
          testResults,
          totalPassed: passed,
          totalFailed: failed,
          totalMs,
          isSample: true,
        });
        return;
      } catch {
        /* fall through */
      }
    }

    // fallback to plain output
    setRunStatus(result.error ? "failed" : "passed");
    setOutput({
      kind: "plain",
      stdout: result.stdout,
      stderr: result.stderr,
      error: result.error,
    });
  };

  // ── Submit (run code + tests, parse structured JSON results) ──
  const handleSubmit = async () => {
    setActiveLeftTab("output");
    setRunKey((k) => k + 1); // force output panel re-mount
    setOutput(null);
    if (pyStatus !== "ready") {
      setOutput({
        kind: "plain",
        stdout: "",
        stderr: "",
        error: "⏳ Python is still loading...",
      });
      return;
    }
    setRunStatus("running");

    const codeToRun = `${code}\n\n${tests}\n\n${TEST_RUNNER_SUFFIX}`;
    const result = await runCode(codeToRun);

    // Parse structured JSON from stdout
    const marker = "__TEST_JSON__:";
    const markerIdx = (result.stdout ?? "").indexOf(marker);
    if (markerIdx !== -1) {
      try {
        const json = result
          .stdout!.slice(markerIdx + marker.length)
          .split("\n")[0];
        const testResults: TestResult[] = JSON.parse(json);
        const passed = testResults.filter((t) => t.status === "passed").length;
        const failed = testResults.filter((t) => t.status === "failed").length;
        const totalMs = testResults.reduce((s, t) => s + t.timeMs, 0);
        setRunStatus(failed > 0 ? "failed" : "passed");
        setOutput({
          kind: "tests",
          testResults,
          totalPassed: passed,
          totalFailed: failed,
          totalMs,
        });

        // If all tests passed, trigger submit to update user points
        if (failed === 0 && passed > 0 && taskSlug) {
          const token = localStorage.getItem("pullgame_token");
          if (token) {
            fetch("/api/submit", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                problemId: taskSlug,
                points:
                  difficulty === "hard"
                    ? 30
                    : difficulty === "medium"
                      ? 20
                      : 10,
              }),
            }).catch(console.error);
          }
        }

        return;
      } catch {
        // fall through to plain output
      }
    }

    // If JSON parsing failed, show raw output
    setRunStatus(result.error ? "failed" : "passed");
    setOutput({
      kind: "plain",
      stdout: result.stdout,
      stderr: result.stderr,
      error: result.error,
    });
  };

  const handleReset = () => {
    setCode(skeleton);
    setRunStatus("idle");
    setOutput(null);
    setActiveLeftTab("description");
  };

  // ── Markdown renderer ──
  const renderDescription = (md: string) => {
    const lines = md.split("\n");
    const elements: React.ReactNode[] = [];
    let inCode = false;
    let codeLines: string[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith("```")) {
        if (inCode) {
          elements.push(
            <pre
              key={i}
              style={{
                background: "#0d0d0d",
                border: "1px solid #222",
                borderRadius: 6,
                padding: "12px 14px",
                margin: "10px 0",
                overflowX: "auto",
                fontFamily: "var(--font-mono)",
                fontSize: 12.5,
                lineHeight: 1.6,
                color: "#e2e8f0",
              }}
            >
              <code>{codeLines.join("\n")}</code>
            </pre>,
          );
          codeLines = [];
          inCode = false;
        } else {
          inCode = true;
        }
        continue;
      }
      if (inCode) {
        codeLines.push(line);
        continue;
      }
      if (line.startsWith("# ")) continue;
      if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={i}
            style={{
              fontSize: 14,
              fontWeight: 700,
              margin: "22px 0 6px",
              color: "#fff",
              borderBottom: "1px solid #1e1e1e",
              paddingBottom: 5,
            }}
          >
            {line.slice(3)}
          </h2>,
        );
        continue;
      }
      if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={i}
            style={{
              fontSize: 13,
              fontWeight: 600,
              margin: "14px 0 4px",
              color: "#ccc",
            }}
          >
            {line.slice(4)}
          </h3>,
        );
        continue;
      }
      if (/^[-*]\s/.test(line)) {
        elements.push(
          <li
            key={i}
            style={{
              fontSize: 13,
              lineHeight: 1.8,
              color: "#aaa",
              marginLeft: 18,
            }}
          >
            {line.replace(/^[-*]\s/, "")}
          </li>,
        );
        continue;
      }
      if (!line.trim()) {
        elements.push(<div key={i} style={{ height: 5 }} />);
        continue;
      }
      const parts = line.split(/(`[^`]+`)/).map((p, j) => {
        if (p.startsWith("`") && p.endsWith("`"))
          return (
            <code
              key={j}
              style={{
                background: "rgba(255,255,255,0.06)",
                padding: "1px 5px",
                borderRadius: 3,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "#7dd3fc",
              }}
            >
              {p.slice(1, -1)}
            </code>
          );
        return p.split(/(\*\*[^*]+\*\*)/).map((s, k) =>
          s.startsWith("**") && s.endsWith("**") ? (
            <strong key={k} style={{ color: "#e2e8f0" }}>
              {s.slice(2, -2)}
            </strong>
          ) : (
            s
          ),
        );
      });
      elements.push(
        <p
          key={i}
          style={{
            fontSize: 13.5,
            lineHeight: 1.8,
            color: "#999",
            margin: "3px 0",
          }}
        >
          {parts}
        </p>,
      );
    }
    return elements;
  };

  // ── Render output panel ──
  const renderOutput = () => {
    if (runStatus === "running") {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              border: "3px solid #222",
              borderTopColor: "#fff",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }}
          />
          <span style={{ color: "#555", fontSize: 13 }}>Running...</span>
        </div>
      );
    }

    if (!output) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 32, opacity: 0.15 }}>▶</span>
          <span style={{ color: "#444", fontSize: 13 }}>
            Run or submit your code to see results.
          </span>
        </div>
      );
    }

    if (output.kind === "plain") {
      const hasError = !!output.error || !!output.stderr;
      return (
        <div
          style={{
            padding: "20px 24px",
            overflow: "auto",
            height: "100%",
            fontFamily: "var(--font-mono)",
            fontSize: 12.5,
          }}
        >
          {/* Status banner */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
              padding: "10px 14px",
              borderRadius: 6,
              background: hasError
                ? "rgba(239,68,68,0.08)"
                : "rgba(16,185,129,0.08)",
              border: `1px solid ${hasError ? "#ef444433" : "#10b98133"}`,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: hasError ? "#ef4444" : "#10b981",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontWeight: 700,
                color: hasError ? "#ef4444" : "#10b981",
                fontSize: 13,
              }}
            >
              {hasError ? "Error" : "Code Ran Successfully"}
            </span>
          </div>

          {output.stdout && (
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  fontSize: 11,
                  color: "#555",
                  marginBottom: 6,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Output
              </div>
              <pre
                style={{
                  background: "#0a0a0a",
                  border: "1px solid #1a1a1a",
                  borderRadius: 6,
                  padding: "10px 14px",
                  color: "#e2e8f0",
                  whiteSpace: "pre-wrap",
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                {output.stdout}
              </pre>
            </div>
          )}
          {(output.error || output.stderr) && (
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "#ef4444",
                  marginBottom: 6,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Traceback
              </div>
              <pre
                style={{
                  background: "rgba(239,68,68,0.05)",
                  border: "1px solid rgba(239,68,68,0.15)",
                  borderRadius: 6,
                  padding: "10px 14px",
                  color: "#fca5a5",
                  whiteSpace: "pre-wrap",
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                {output.error ?? output.stderr}
              </pre>
            </div>
          )}
          {!output.stdout && !output.error && !output.stderr && (
            <div style={{ color: "#444", fontSize: 13 }}>(no output)</div>
          )}
        </div>
      );
    }

    // ── Test results view ──
    const {
      testResults = [],
      totalPassed = 0,
      totalFailed = 0,
      totalMs = 0,
    } = output;
    const allPassed = totalFailed === 0;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* Summary banner */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #111",
            flexShrink: 0,
            background: allPassed
              ? "rgba(16,185,129,0.05)"
              : "rgba(239,68,68,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22 }}>{allPassed ? "✓" : "✗"}</span>
              <div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 16,
                    color: allPassed ? "#10b981" : "#ef4444",
                  }}
                >
                  {output.isSample
                    ? allPassed
                      ? "Sample Test Passed"
                      : "Sample Test Failed"
                    : allPassed
                      ? "All Tests Passed"
                      : `${totalFailed} Test${totalFailed > 1 ? "s" : ""} Failed`}
                </div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
                  {output.isSample
                    ? "Ran 1 sample test case"
                    : `${totalPassed}/${testResults.length} passed`}{" "}
                  · {totalMs.toFixed(1)}ms
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {totalPassed > 0 && (
                <div
                  style={{
                    padding: "4px 12px",
                    borderRadius: 20,
                    background: "rgba(16,185,129,0.12)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#10b981",
                  }}
                >
                  {totalPassed} passed
                </div>
              )}
              {totalFailed > 0 && (
                <div
                  style={{
                    padding: "4px 12px",
                    borderRadius: 20,
                    background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#ef4444",
                  }}
                >
                  {totalFailed} failed
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Individual test cases */}
        <div style={{ flex: 1, overflow: "auto", padding: "12px 24px 24px" }}>
          {testResults.map((t, i) => (
            <TestCard key={i} test={t} index={i} />
          ))}
        </div>
      </div>
    );
  };

  const pyStatusColor = {
    idle: "#555",
    loading: "#f59e0b",
    ready: "#10b981",
    error: "#ef4444",
  }[pyStatus];

  return (
    <div
      ref={containerRef}
      className="coding-terminal"
      style={{ userSelect: isResizing ? "none" : "auto" }}
    >
      {/* ===== LEFT ===== */}
      <div
        className="coding-terminal-left"
        style={{ flex: `0 0 ${leftWidth}%` }}
      >
        <div className="coding-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a
              href={backHref}
              style={{
                color: "#555",
                textDecoration: "none",
                fontSize: 18,
                lineHeight: 1,
              }}
            >
              ←
            </a>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{title}</span>
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 4,
                fontSize: 10,
                fontWeight: 700,
                color: diffColors[difficulty],
                border: `1px solid ${diffColors[difficulty]}33`,
                background: `${diffColors[difficulty]}11`,
              }}
            >
              {diffLabels[difficulty]}
            </span>
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {(["description", "output"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveLeftTab(tab)}
                style={{
                  padding: "4px 12px",
                  borderRadius: 5,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  background:
                    activeLeftTab === tab
                      ? "rgba(255,255,255,0.07)"
                      : "transparent",
                  border: "none",
                  color: activeLeftTab === tab ? "#fff" : "#555",
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                {tab === "output" && runStatus === "passed" && (
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#10b981",
                    }}
                  />
                )}
                {tab === "output" && runStatus === "failed" && (
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#ef4444",
                    }}
                  />
                )}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {activeLeftTab === "description" ? (
          <div className="description-panel">
            <h1
              style={{
                fontSize: 21,
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
          <div
            key={runKey}
            style={{
              flex: 1,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {renderOutput()}
          </div>
        )}
      </div>

      {/* ===== RESIZER ===== */}
      <div
        className={`resizer ${isResizing ? "active" : ""}`}
        onMouseDown={startResize}
      />

      {/* ===== RIGHT ===== */}
      <div className="coding-terminal-right">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 16px",
            borderBottom: "1px solid #111",
            background: "#070707",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", gap: 2 }}>
            {(["solution", "tests"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveRightTab(tab)}
                style={{
                  padding: "4px 12px",
                  borderRadius: 5,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  background:
                    activeRightTab === tab
                      ? "rgba(255,255,255,0.07)"
                      : "transparent",
                  border: "none",
                  color: activeRightTab === tab ? "#fff" : "#444",
                  transition: "all 0.15s",
                }}
              >
                {tab === "solution" ? "solution.py" : "test.py"}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 11,
                color: pyStatusColor,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: pyStatusColor,
                  animation:
                    pyStatus === "loading" ? "pulse 1.5s infinite" : "none",
                }}
              />
              {
                {
                  idle: "Loading...",
                  loading: "Loading Python...",
                  ready: "Python Ready",
                  error: "Load Failed",
                }[pyStatus]
              }
            </span>
            <button
              onClick={handleReset}
              style={{
                padding: "4px 10px",
                borderRadius: 5,
                fontSize: 11,
                fontWeight: 600,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid #1a1a1a",
                color: "#555",
                cursor: "pointer",
              }}
            >
              ↺
            </button>
            <button
              onClick={handleRun}
              disabled={runStatus === "running"}
              style={{
                padding: "5px 16px",
                borderRadius: 5,
                fontSize: 12,
                fontWeight: 600,
                background: "#111",
                border: "1px solid #222",
                color: runStatus === "running" ? "#444" : "#fff",
                cursor: runStatus === "running" ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
                transition: "all 0.15s",
              }}
            >
              {runStatus === "running" ? (
                <>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      border: "2px solid #333",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />{" "}
                  Running
                </>
              ) : (
                "▶ Run"
              )}
            </button>
            <button
              onClick={handleSubmit}
              disabled={runStatus === "running"}
              style={{
                padding: "5px 16px",
                borderRadius: 5,
                fontSize: 12,
                fontWeight: 700,
                cursor: runStatus === "running" ? "not-allowed" : "pointer",
                background:
                  runStatus === "passed"
                    ? "#10b981"
                    : runStatus === "failed"
                      ? "#ef4444"
                      : "#1a1a1a",
                border: `1px solid ${runStatus === "passed" ? "#10b981" : runStatus === "failed" ? "#ef4444" : "#333"}`,
                color:
                  runStatus === "passed" || runStatus === "failed"
                    ? "#000"
                    : "#ccc",
                transition: "all 0.2s",
              }}
            >
              ✓ Submit
            </button>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflow: "hidden",
            display: activeRightTab === "solution" ? "flex" : "none",
            flexDirection: "column",
          }}
        >
          <Suspense
            fallback={
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#333",
                  fontSize: 13,
                }}
              >
                Loading editor...
              </div>
            }
          >
            <MonacoEditor
              height="100%"
              language="python"
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val ?? "")}
              options={{
                fontSize: 13.5,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                minimap: { enabled: false },
                lineNumbers: "on",
                lineNumbersMinChars: 3,
                scrollBeyondLastLine: false,
                wordWrap: "on",
                tabSize: 4,
                insertSpaces: true,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                glyphMargin: false,
                overviewRulerBorder: false,
                scrollbar: {
                  verticalScrollbarSize: 6,
                  horizontalScrollbarSize: 6,
                },
              }}
            />
          </Suspense>
        </div>
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            display: activeRightTab === "tests" ? "flex" : "none",
            flexDirection: "column",
          }}
        >
          <Suspense fallback={null}>
            <MonacoEditor
              height="100%"
              language="python"
              theme="vs-dark"
              value={tests}
              options={{
                fontSize: 13.5,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                minimap: { enabled: false },
                readOnly: true,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                wordWrap: "on",
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                glyphMargin: false,
                overviewRulerBorder: false,
                scrollbar: {
                  verticalScrollbarSize: 6,
                  horizontalScrollbarSize: 6,
                },
              }}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// ── Individual test case card ──
function TestCard({ test, index }: { test: TestResult; index: number }) {
  const [expanded, setExpanded] = useState(test.status === "failed");
  const passed = test.status === "passed";

  return (
    <div
      style={{
        marginTop: 10,
        border: `1px solid ${passed ? "#10b98122" : "#ef444422"}`,
        borderRadius: 8,
        overflow: "hidden",
        background: passed ? "rgba(16,185,129,0.03)" : "rgba(239,68,68,0.03)",
      }}
    >
      {/* Header row */}
      <button
        onClick={() => setExpanded((e) => !e)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {/* Status icon */}
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: passed
              ? "rgba(16,185,129,0.15)"
              : "rgba(239,68,68,0.15)",
            border: `1px solid ${passed ? "#10b981" : "#ef4444"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: passed ? "#10b981" : "#ef4444",
            }}
          >
            {passed ? "✓" : "✗"}
          </span>
        </div>

        {/* Test name */}
        <span
          style={{
            flex: 1,
            fontSize: 13,
            fontWeight: 600,
            color: passed ? "#e2e8f0" : "#fca5a5",
            fontFamily: "var(--font-mono)",
          }}
        >
          {test.name.replace("test_", "").replaceAll("_", " ")}
        </span>

        {/* Case index */}
        <span style={{ fontSize: 11, color: "#444", fontWeight: 500 }}>
          Case {index + 1}
        </span>

        {/* Time */}
        <span
          style={{
            fontSize: 11,
            color: "#555",
            fontFamily: "var(--font-mono)",
            minWidth: 50,
            textAlign: "right",
          }}
        >
          {test.timeMs}ms
        </span>

        {/* Expand chevron */}
        <span
          style={{
            fontSize: 10,
            color: "#444",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          ▼
        </span>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div
          style={{
            padding: "0 16px 14px",
            borderTop: `1px solid ${passed ? "#10b98118" : "#ef444418"}`,
          }}
        >
          {test.output && (
            <div style={{ marginTop: 12 }}>
              <div
                style={{
                  fontSize: 10,
                  color: "#555",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Output
              </div>
              <pre
                style={{
                  background: "#060606",
                  border: "1px solid #1a1a1a",
                  borderRadius: 5,
                  padding: "8px 12px",
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                  color: "#ccc",
                  whiteSpace: "pre-wrap",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {test.output}
              </pre>
            </div>
          )}
          {test.error && (
            <div style={{ marginTop: 12 }}>
              <div
                style={{
                  fontSize: 10,
                  color: "#ef4444",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Traceback
              </div>
              <pre
                style={{
                  background: "rgba(239,68,68,0.04)",
                  border: "1px solid rgba(239,68,68,0.12)",
                  borderRadius: 5,
                  padding: "8px 12px",
                  fontSize: 11.5,
                  fontFamily: "var(--font-mono)",
                  color: "#fca5a5",
                  whiteSpace: "pre-wrap",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {test.error}
              </pre>
            </div>
          )}
          {!test.output && !test.error && (
            <div style={{ marginTop: 10, fontSize: 12, color: "#444" }}>
              No output captured.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
