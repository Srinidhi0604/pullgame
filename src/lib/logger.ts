/**
 * Logging utilities with consistent formatting
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
  stack?: string;
}

/**
 * Format log entry for console output
 */
function formatLogEntry(entry: LogEntry): string {
  const level = entry.level.toUpperCase().padEnd(6);
  const timestamp = entry.timestamp;
  return `[${timestamp}] ${level} ${entry.message}`;
}

/**
 * Logger utility class
 */
export const logger = {
  /**
   * Log info level message
   */
  info(message: string, data?: unknown): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "info",
      message,
      data,
    };
    console.log(formatLogEntry(entry), data ? data : "");
  },

  /**
   * Log warning level message
   */
  warn(message: string, data?: unknown): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "warn",
      message,
      data,
    };
    console.warn(formatLogEntry(entry), data ? data : "");
  },

  /**
   * Log error level message
   */
  error(message: string, error?: Error | unknown): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "error",
      message,
      stack: error instanceof Error ? error.stack : undefined,
    };
    console.error(formatLogEntry(entry), error ? error : "");
  },

  /**
   * Log debug level message
   */
  debug(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === "development") {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: "debug",
        message,
        data,
      };
      console.debug(formatLogEntry(entry), data ? data : "");
    }
  },
};
