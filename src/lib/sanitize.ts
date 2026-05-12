/**
 * Input sanitization and normalization utilities
 */

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };

  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === "string") {
      sanitized[key as keyof T] = sanitizeString(value) as never;
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      sanitized[key as keyof T] = sanitizeObject(value as Record<string, unknown>) as never;
    } else if (Array.isArray(value)) {
      sanitized[key as keyof T] = value.map((item) =>
        typeof item === "string" ? sanitizeString(item) : item
      ) as never;
    }
  }

  return sanitized;
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== "string") return "";

  return input
    .trim()
    .replace(/[<>]/g, "")
    .slice(0, 10000); // Max length protection
}

/**
 * Normalize and sanitize email
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Normalize and sanitize username
 */
export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase().slice(0, 20);
}

/**
 * Sanitize JSON string
 */
export function sanitizeJson(jsonString: string): string {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed);
  } catch {
    return "{}";
  }
}

/**
 * Remove sensitive fields from object
 */
export function removeSensitiveFields<T extends Record<string, unknown>>(
  obj: T,
  fieldsToRemove: (keyof T)[] = ["password", "token", "secret", "apiKey"]
): Partial<T> {
  const result = { ...obj };

  for (const field of fieldsToRemove) {
    delete result[field];
  }

  return result;
}

/**
 * Truncate string safely
 */
export function truncateSafely(str: string, maxLength: number = 100): string {
  if (!str || typeof str !== "string") return "";
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + "...";
}

/**
 * Clean code content
 */
export function sanitizeCode(code: string): string {
  if (!code || typeof code !== "string") return "";

  // Remove potentially dangerous content
  let sanitized = code
    .replace(/process\./g, "")
    .replace(/require\(/g, "")
    .replace(/import\s+/g, "")
    .replace(/eval\(/g, "");

  return sanitized.slice(0, 50000); // Max code length
}

/**
 * Sanitize URL parameters
 */
export function sanitizeUrlParams(params: Record<string, unknown>): Record<string, string> {
  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      sanitized[key] = encodeURIComponent(value.trim().slice(0, 1000));
    } else if (typeof value === "number" || typeof value === "boolean") {
      sanitized[key] = String(value);
    }
  }

  return sanitized;
}

/**
 * Validate and sanitize array of strings
 */
export function sanitizeStringArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];

  return arr
    .filter((item): item is string => typeof item === "string")
    .map((str) => sanitizeString(str))
    .slice(0, 100); // Max array length
}

/**
 * Normalize line breaks in text
 */
export function normalizeLineBreaks(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

/**
 * Remove non-ASCII characters
 */
export function removeNonAscii(text: string): string {
  return text.replace(/[^\x20-\x7E\n\r\t]/g, "");
}

/**
 * Safe JSON stringify with error handling
 */
export function safeJsonStringify(
  obj: unknown,
  maxDepth: number = 10
): string {
  try {
    let depth = 0;
    return JSON.stringify(obj, (key, value) => {
      depth++;
      if (depth > maxDepth) {
        return "[DEPTH_EXCEEDED]";
      }
      if (typeof value === "object" && value !== null && Object.keys(value).length > 1000) {
        return "[LARGE_OBJECT]";
      }
      return value;
    });
  } catch {
    return "{}";
  }
}
