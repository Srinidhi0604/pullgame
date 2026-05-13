/**
 * Middleware and request handling utilities
 */

import { NextApiRequest, NextApiResponse } from "next";

/**
 * CORS middleware configuration
 */
export interface CorsOptions {
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  credentials: boolean;
  maxAge: number;
}

/**
 * Default CORS configuration
 */
export const DEFAULT_CORS_CONFIG: CorsOptions = {
  allowedOrigins: ["http://localhost:3000", process.env.NEXT_PUBLIC_APP_URL || ""].filter(
    Boolean
  ),
  allowedMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400,
};

/**
 * Apply CORS headers to response
 */
export function applyCorsHeaders(
  req: NextApiRequest,
  res: NextApiResponse,
  options: CorsOptions = DEFAULT_CORS_CONFIG
): void {
  const origin = req.headers.origin || "";

  if (options.allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", options.allowedMethods.join(","));
  res.setHeader("Access-Control-Allow-Headers", options.allowedHeaders.join(","));
  res.setHeader("Access-Control-Max-Age", String(options.maxAge));

  if (options.credentials) {
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
}

/**
 * Handle OPTIONS request for CORS preflight
 */
export function handleCorsOptions(
  req: NextApiRequest,
  res: NextApiResponse,
  options?: CorsOptions
): boolean {
  if (req.method === "OPTIONS") {
    applyCorsHeaders(req, res, options);
    res.status(200).end();
    return true;
  }
  return false;
}

/**
 * Validate request method
 */
export function validateMethod(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedMethods: string[]
): boolean {
  if (!req.method || !allowedMethods.includes(req.method)) {
    res.status(405).json({
      success: false,
      error: "Method not allowed",
      allowed: allowedMethods,
    });
    return false;
  }
  return true;
}

/**
 * Validate Content-Type header
 */
export function validateContentType(
  req: NextApiRequest,
  res: NextApiResponse,
  expectedType: string
): boolean {
  const contentType = req.headers["content-type"];

  if (!contentType || !contentType.includes(expectedType)) {
    res.status(400).json({
      success: false,
      error: `Expected Content-Type: ${expectedType}`,
    });
    return false;
  }

  return true;
}

/**
 * Extract authorization token from request
 */
export function extractAuthToken(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1];
}

/**
 * Middleware wrapper type
 */
export type ApiMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void | Promise<void>
) => void | Promise<void>;

/**
 * Compose multiple middlewares
 */
export function composeMiddleware(...middlewares: ApiMiddleware[]) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    let index = -1;

    const dispatch = async (i: number): Promise<void> => {
      if (i <= index) return;
      index = i;

      if (i < middlewares.length) {
        await middlewares[i](req, res, () => dispatch(i + 1));
      }
    };

    await dispatch(0);
  };
}

/**
 * Try-catch wrapper for async route handlers
 */
export function asyncHandler(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error("Handler error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: "Internal server error",
        });
      }
    }
  };
}

/**
 * Add security headers to response
 */
export function addSecurityHeaders(res: NextApiResponse): void {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Content-Security-Policy", "default-src 'self'");
}

/**
 * Add no-cache headers
 */
export function addNoCacheHeaders(res: NextApiResponse): void {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
}

/**
 * Add cache headers
 */
export function addCacheHeaders(res: NextApiResponse, maxAgeSeconds: number = 3600): void {
  res.setHeader("Cache-Control", `public, max-age=${maxAgeSeconds}`);
  res.setHeader("ETag", `"${Date.now()}"`);
}
