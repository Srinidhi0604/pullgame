"use client";

import { useState } from "react";

interface SolveSectionProps {
  skeleton: string;
  tests: string;
}

export function SolveSection({ skeleton, tests }: SolveSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState(skeleton);
  const [output, setOutput] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "running" | "passed" | "failed">("idle");

  const handleRun = () => {
    setStatus("running");
    setOutput(null);

    // Simulate test execution
    setTimeout(() => {
      const passed = Math.random() > 0.5;
      setStatus(passed ? "passed" : "failed");
      setOutput(
        passed
          ? "✓ All tests passed!\n\n  test_shape_check ............... PASSED\n  test_value_check ............... PASSED\n  test_edge_cases ................ PASSED\n\n  3 passed in 0.42s"
          : "✗ Tests failed\n\n  test_shape_check ............... PASSED\n  test_value_check ............... FAILED\n\n  AssertionError: Expected output to match reference.\n  Got: None\n  Expected: ndarray of shape (2, 4, 16)\n\n  1 passed, 1 failed in 0.38s"
      );
    }, 1800);
  };

  const handleReset = () => {
    setCode(skeleton);
    setOutput(null);
    setStatus("idle");
  };

  if (!isOpen) {
    return (
      <div style={{ textAlign: "center" }}>
        <button
          onClick={() => setIsOpen(true)}
          className="btn-primary"
          style={{
            padding: "14px 48px",
            fontSize: 16,
            fontWeight: 700,
            borderRadius: 12,
          }}
        >
          Start Solving
        </button>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      {/* Editor Header */}
      <div
        className="glass-card-static"
        style={{
          borderRadius: "16px 16px 0 0",
          borderBottom: "none",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10b981" }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
            solution.py
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleReset}
            className="btn-secondary"
            style={{ padding: "6px 16px", fontSize: 12 }}
          >
            Reset
          </button>
          <button
            onClick={handleRun}
            disabled={status === "running"}
            className="btn-primary"
            style={{
              padding: "6px 20px",
              fontSize: 12,
              opacity: status === "running" ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {status === "running" ? (
              <>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "white",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Running...
              </>
            ) : (
              <>▶ Run Tests</>
            )}
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        style={{
          width: "100%",
          minHeight: 300,
          background: "rgba(0, 0, 0, 0.5)",
          border: "1px solid var(--glass-border)",
          borderTop: "none",
          borderBottom: output ? "none" : undefined,
          borderRadius: output ? 0 : "0 0 16px 16px",
          padding: 24,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: 13,
          lineHeight: 1.7,
          color: "#e2e8f0",
          resize: "vertical",
          outline: "none",
          tabSize: 4,
        }}
      />

      {/* Output Panel */}
      {output && (
        <div
          style={{
            background:
              status === "passed"
                ? "rgba(16, 185, 129, 0.05)"
                : "rgba(239, 68, 68, 0.05)",
            border: "1px solid",
            borderColor:
              status === "passed"
                ? "rgba(16, 185, 129, 0.2)"
                : "rgba(239, 68, 68, 0.2)",
            borderTop: "none",
            borderRadius: "0 0 16px 16px",
            padding: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: status === "passed" ? "var(--accent-green)" : "var(--accent-red)",
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: status === "passed" ? "var(--accent-green)" : "var(--accent-red)",
              }}
            >
              {status === "passed" ? "Tests Passed" : "Tests Failed"}
            </span>
          </div>
          <pre
            style={{
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: 12,
              lineHeight: 1.6,
              color: "var(--text-secondary)",
              whiteSpace: "pre-wrap",
              margin: 0,
            }}
          >
            {output}
          </pre>
        </div>
      )}

      {/* Spinner animation */}
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
