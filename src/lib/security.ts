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

/**
 * Sanitize string for SQL injection prevention
 */
export function sanitizeForSql(input: string): string {
  return input.replace(/'/g, "''").replace(/"/g, '\\"');
}

/**
 * Check if URL is safe and not a potential security risk
 */
export function isSafeUrl(url: string, baseUrl: string): boolean {
  try {
    const urlObj = new URL(url, baseUrl);
    const baseUrlObj = new URL(baseUrl);
    return urlObj.hostname === baseUrlObj.hostname;
  } catch {
    return false;
  }
}

/**
 * Encrypt data using AES
 */
export function encryptData(data: string, key: string): string {
  const iv = crypto.randomBytes(16);
  const hash = crypto.createHash("sha256").update(key).digest();
  const cipher = crypto.createCipheriv("aes-256-cbc", hash, iv);

  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

/**
 * Decrypt data using AES
 */
export function decryptData(encryptedData: string, key: string): string {
  const parts = encryptedData.split(":");
  const iv = Buffer.from(parts[0], "hex");
  const encrypted = parts[1];
  const hash = crypto.createHash("sha256").update(key).digest();

  const decipher = crypto.createDecipheriv("aes-256-cbc", hash, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Create secure HTTP-only cookie string
 */
export function createSecureCookie(name: string, value: string, maxAge: number): string {
  return `${name}=${value}; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict; Path=/`;
}

/**
 * Extract IP from request headers
 */
export function getClientIp(headers: Record<string, unknown>): string {
  const xForwardedFor = headers["x-forwarded-for"];
  if (xForwardedFor && typeof xForwardedFor === "string") {
    return xForwardedFor.split(",")[0].trim();
  }

  const xRealIp = headers["x-real-ip"];
  if (xRealIp && typeof xRealIp === "string") {
    return xRealIp;
  }

  return "unknown";
}
