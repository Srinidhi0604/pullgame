/**
 * Input validation utilities
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate username format (alphanumeric, underscores, hyphens only)
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string, minLength: number = 8): boolean {
  if (password.length < minLength) return false;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  return hasUpperCase && hasLowerCase && hasNumbers;
}

/**
 * Sanitize string input
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate page number and size
 */
export function isValidPagination(page: number, pageSize: number): boolean {
  return page > 0 && pageSize > 0 && pageSize <= 100;
}

/**
 * Check if string is a valid MongoDB ObjectId
 */
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Validate rating value (1-5)
 */
export function isValidRating(rating: number): boolean {
  return rating >= 1 && rating <= 5 && Number.isInteger(rating);
}

/**
 * Validate array is not empty
 */
export function isNonEmptyArray<T>(arr: unknown): arr is T[] {
  return Array.isArray(arr) && arr.length > 0;
}

/**
 * Validate string length
 */
export function validateStringLength(str: string, min: number, max: number): boolean {
  const length = str.trim().length;
  return length >= min && length <= max;
}

/**
 * Validate year is valid (1900-2100)
 */
export function isValidYear(year: number): boolean {
  return year >= 1900 && year <= 2100 && Number.isInteger(year);
}

/**
 * Validate code snippet (basic check)
 */
export function isValidCode(code: string): boolean {
  return code.trim().length > 0 && code.length <= 50000;
}

/**
 * Validate test input/output format
 */
export function isValidTestCase(input: string, expectedOutput: string): boolean {
  return input.trim().length > 0 && expectedOutput.trim().length > 0;
}

/**
 * Sanitize HTML entities
 */
export function sanitizeHtml(input: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
  };
  return input.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Validate required fields
 */
export function validateRequired<T extends Record<string, unknown>>(
  obj: T,
  fields: (keyof T)[]
): { valid: boolean; missingFields: (keyof T)[] } {
  const missingFields = fields.filter((field) => !obj[field]);
  return { valid: missingFields.length === 0, missingFields };
}
