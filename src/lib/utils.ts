/**
 * Common utility and formatting functions
 */

/**
 * Format a date to readable string
 * @param date - The date to format (Date object or ISO string)
 * @returns Formatted date string (e.g., "January 15, 2024")
 * @example
 * formatDate(new Date()) // "January 15, 2024"
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a date with time
 * @param date - The date to format (Date object or ISO string)
 * @returns Formatted date-time string (e.g., "Jan 15, 2024, 02:30 PM")
 * @example
 * formatDateTime(new Date()) // "Jan 15, 2024, 02:30 PM"
 */
export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param date - The date to format relative to now
 * @returns Relative time string (e.g., "2h ago", "just now")
 * @example
 * formatRelativeTime(new Date(Date.now() - 2*60*60*1000)) // "2h ago"
 */
export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

/**
 * Truncate text to specified length with ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length (default: 50)
 * @returns Truncated text with "..." if exceeded
 * @example
 * truncateText("Hello World", 5) // "Hello..."
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Capitalize first letter of string
 * @param str - The string to capitalize
 * @returns String with first letter capitalized
 * @example
 * capitalize("hello") // "Hello"
 */
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate a random ID string
 * @returns Random alphanumeric ID
 * @example
 * generateId() // "a1b2c3d4e"
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Delay execution for specified milliseconds
 * @param ms - Number of milliseconds to delay
 * @returns Promise that resolves after delay
 * @example
 * await delay(1000); // Waits 1 second
 */
export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if object is empty
 * @param obj - Object to check
 * @returns True if object has no keys
 * @example
 * isEmpty({}) // true
 * isEmpty({a: 1}) // false
 */
export function isEmpty(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Format file size in bytes to readable format
 * @param bytes - Number of bytes
 * @returns Formatted size string (e.g., "1.50 MB")
 * @example
 * formatFileSize(1048576) // "1.00 MB"
 */
export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Debounce a function - delay execution until called no more
 * @param func - Function to debounce
 * @param delayMs - Delay in milliseconds
 * @returns Debounced function
 * @example
 * const debouncedSearch = debounce(handleSearch, 300);
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delayMs);
  };
}
