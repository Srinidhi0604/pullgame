/**
 * Security utilities and middleware helpers
 */

import crypto from "crypto";

/**
 * Generate random string
 */
export function generateRandomString(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Hash string using SHA256
 */
export function hashString(str: string): string {
  return crypto.createHash("sha256").update(str).digest("hex");
}

/**
 * Sanitize HTML input to prevent XSS
 */
export function sanitizeHtml(input: string): string {
  const htmlEscapeMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return input.replace(/[&<>"']/g, (char) => htmlEscapeMap[char]);
}

/**
 * Validate CSRF token
 */
export function validateCsrfToken(token: string, sessionToken: string): boolean {
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(sessionToken));
}

/**
 * Generate CSRF token
 */
export function generateCsrfToken(): string {
  return generateRandomString(32);
}

/**
 * Check if IP is in rate limit
 */
export function isIpRateLimited(
  ip: string,
  rateMap: Map<string, number[]>
): boolean {
  const timestamps = rateMap.get(ip) || [];
  const oneMinuteAgo = Date.now() - 60000;

  // Remove old timestamps
  const recentRequests = timestamps.filter((t) => t > oneMinuteAgo);

  return recentRequests.length >= 100; // 100 requests per minute
}

/**
 * Track request for rate limiting
 */
export function trackRequest(ip: string, rateMap: Map<string, number[]>): void {
  const timestamps = rateMap.get(ip) || [];
  timestamps.push(Date.now());
  rateMap.set(ip, timestamps);

  // Clean old entries
  const oneHourAgo = Date.now() - 3600000;
  const recentTimestamps = timestamps.filter((t) => t > oneHourAgo);
  rateMap.set(ip, recentTimestamps);
}

/**
 * Validate request origin
 */
export function isValidOrigin(origin: string, allowedOrigins: string[]): boolean {
  return allowedOrigins.includes(origin);
}

/**
 * Create signed URL
 */
export function createSignedUrl(
  path: string,
  secret: string,
  expiresIn: number = 3600
): string {
  const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;
  const signature = hashString(`${path}${expiresAt}${secret}`);
  return `${path}?expires=${expiresAt}&signature=${signature}`;
}

/**
 * Verify signed URL
 */
export function verifySignedUrl(url: string, secret: string): boolean {
  const urlObj = new URL(url);
  const expiresAt = parseInt(urlObj.searchParams.get("expires") || "0");
  const signature = urlObj.searchParams.get("signature") || "";
  const path = urlObj.pathname;

  if (Math.floor(Date.now() / 1000) > expiresAt) {
    return false;
  }

  const expectedSignature = hashString(`${path}${expiresAt}${secret}`);
  return signature === expectedSignature;
}
