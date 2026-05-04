"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type PyodideStatus = "idle" | "loading" | "ready" | "error";

// Minimal typing for what we use from Pyodide
interface PyodideGlobals {
  set: (key: string, value: unknown) => void;
  get: (key: string) => unknown;
}
interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackagesFromImports: (code: string) => Promise<void>;
  globals: PyodideGlobals;
}

// Module-level singletons so Pyodide is only ever loaded once
let pyodideInstance: PyodideInterface | null = null;
let loadingPromise: Promise<PyodideInterface> | null = null;

async function loadPyodideInstance(): Promise<PyodideInterface> {
  if (pyodideInstance) return pyodideInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const pyodide = await (window as unknown as {
      loadPyodide: (opts: { indexURL: string }) => Promise<PyodideInterface>;
    }).loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
    });
    pyodideInstance = pyodide;
    return pyodide;
  })();

  return loadingPromise;
}

export interface RunResult {
  stdout: string;
  stderr: string;
  error: string | null;
}

export function usePyodide() {
  const [status, setStatus] = useState<PyodideStatus>("idle");
  const pyodideRef = useRef<PyodideInterface | null>(null);

  useEffect(() => {
    // If Pyodide is already loaded (e.g. navigated back to page), reuse it
    if (pyodideInstance) {
      pyodideRef.current = pyodideInstance;
      setStatus("ready");
      return;
    }
    if (loadingPromise) {
      setStatus("loading");
      loadingPromise
        .then((py) => { pyodideRef.current = py; setStatus("ready"); })
        .catch(() => setStatus("error"));
      return;
    }

    // Inject the CDN script once
    if (!document.getElementById("pyodide-script")) {
      const script = document.createElement("script");
      script.id = "pyodide-script";
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";
      script.onload = () => {
        setStatus("loading");
        loadPyodideInstance()
          .then((py) => { pyodideRef.current = py; setStatus("ready"); })
          .catch(() => setStatus("error"));
      };
      script.onerror = () => setStatus("error");
      document.head.appendChild(script);
      setStatus("loading");
    }
  }, []);

  const runCode = useCallback(async (code: string): Promise<RunResult> => {
    const py = pyodideRef.current;
    if (!py) {
      return { stdout: "", stderr: "", error: "Python runtime not yet loaded. Please wait." };
    }

    try {
      // Auto-install any top-level imports (numpy, pandas, etc.)
      await py.loadPackagesFromImports(code);
    } catch {
      // ignore package load errors — let the exec itself surface them
    }

    try {
      // Pass the user code as a Pyodide global to avoid quoting/escaping issues
      py.globals.set("_user_code", code);

      // Run a wrapper that captures stdout/stderr and stores them as globals
      await py.runPythonAsync(`
import sys, io, traceback as _tb

_out_buf = io.StringIO()
_err_buf = io.StringIO()
_saved_out = sys.stdout
_saved_err = sys.stderr

try:
    sys.stdout = _out_buf
    sys.stderr = _err_buf
    exec(_user_code, {"__name__": "__main__"})
    _run_error = None
except Exception:
    _run_error = _tb.format_exc()
finally:
    sys.stdout = _saved_out
    sys.stderr = _saved_err

_captured_out = _out_buf.getvalue()
_captured_err = _err_buf.getvalue()
`);

      // Read results back as plain JS strings via globals
      const stdout  = (py.globals.get("_captured_out")  as string) ?? "";
      const stderr  = (py.globals.get("_captured_err")  as string) ?? "";
      const runError = py.globals.get("_run_error");
      const errorStr = (runError && String(runError) !== "None") ? String(runError) : null;

      return { stdout: stdout.trim(), stderr: stderr.trim(), error: errorStr };
    } catch (e) {
      return { stdout: "", stderr: "", error: String(e) };
    }
  }, []);

  return { status, runCode };
}
