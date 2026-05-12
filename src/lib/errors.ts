/**
 * Error handling and custom error classes
 */

/**
 * Base application error class
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(401, message);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Authorization error
 */
export class AuthorizationError extends AppError {
  constructor(message: string = "Access denied") {
    super(403, message);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(404, `${resource} not found`);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Conflict error
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Rate limit error
 */
export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests") {
    super(429, message);
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

/**
 * Server error
 */
export class ServerError extends AppError {
  constructor(message: string = "Internal server error") {
    super(500, message);
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

/**
 * Database error
 */
export class DatabaseError extends AppError {
  constructor(message: string = "Database operation failed") {
    super(500, message);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

/**
 * Timeout error
 */
export class TimeoutError extends AppError {
  constructor(message: string = "Request timeout") {
    super(408, message);
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

/**
 * Bad gateway error
 */
export class BadGatewayError extends AppError {
  constructor(message: string = "Service unavailable") {
    super(502, message);
    Object.setPrototypeOf(this, BadGatewayError.prototype);
  }
}

/**
 * Check if error is operational (expected error)
 */
export function isOperationalError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}

/**
 * Format error for logging
 */
export function formatErrorForLogging(error: unknown): object {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
      isOperational: error.isOperational,
      type: error.constructor.name,
    };
  }
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      type: error.constructor.name,
    };
  }
  return { error: String(error) };
}
