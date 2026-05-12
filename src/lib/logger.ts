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

/**
 * Log API request with method, path, and query parameters
 */
export function logApiRequest(
  method: string,
  path: string,
  params?: Record<string, unknown>
): void {
  logger.info(`${method} ${path}`, params);
}

/**
 * Log API response with status code and response time
 */
export function logApiResponse(
  method: string,
  path: string,
  statusCode: number,
  responseTimeMs: number
): void {
  logger.info(
    `${method} ${path} - ${statusCode} (${responseTimeMs}ms)`
  );
}

/**
 * Log database operation
 */
export function logDatabaseOperation(
  operation: string,
  collection: string,
  responseTimeMs: number
): void {
  logger.debug(`DB [${operation}] ${collection} (${responseTimeMs}ms)`);
}

/**
 * Log authentication event
 */
export function logAuthEvent(event: string, userId?: string): void {
  logger.info(`AUTH: ${event}${userId ? ` [User: ${userId}]` : ""}`);
}

/**
 * Log security event
 */
export function logSecurityEvent(event: string, details?: Record<string, unknown>): void {
  logger.warn(`SECURITY: ${event}`, details);
}

/**
 * Measure and log function execution time
 */
export async function measureExecution<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - startTime;
    logger.debug(`${name} completed in ${duration.toFixed(2)}ms`);
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    logger.error(`${name} failed after ${duration.toFixed(2)}ms`, error);
    throw error;
  }
}
