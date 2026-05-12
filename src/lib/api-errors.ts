/**
 * Common API error codes and response definitions
 */

export enum ApiErrorCode {
  // Client errors (4xx)
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  REQUEST_TIMEOUT = "REQUEST_TIMEOUT",

  // Server errors (5xx)
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  DATABASE_ERROR = "DATABASE_ERROR",

  // Business logic errors
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  DUPLICATE_RESOURCE = "DUPLICATE_RESOURCE",
  INVALID_OPERATION = "INVALID_OPERATION",
  AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED",
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
}

export interface ErrorDetails {
  code: ApiErrorCode;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

export const API_ERRORS: Record<ApiErrorCode, ErrorDetails> = {
  // Client errors
  [ApiErrorCode.BAD_REQUEST]: {
    code: ApiErrorCode.BAD_REQUEST,
    message: "Bad request",
    statusCode: 400,
  },

  [ApiErrorCode.UNAUTHORIZED]: {
    code: ApiErrorCode.UNAUTHORIZED,
    message: "Authentication required",
    statusCode: 401,
  },

  [ApiErrorCode.FORBIDDEN]: {
    code: ApiErrorCode.FORBIDDEN,
    message: "Access denied",
    statusCode: 403,
  },

  [ApiErrorCode.NOT_FOUND]: {
    code: ApiErrorCode.NOT_FOUND,
    message: "Resource not found",
    statusCode: 404,
  },

  [ApiErrorCode.CONFLICT]: {
    code: ApiErrorCode.CONFLICT,
    message: "Resource conflict",
    statusCode: 409,
  },

  [ApiErrorCode.VALIDATION_ERROR]: {
    code: ApiErrorCode.VALIDATION_ERROR,
    message: "Validation failed",
    statusCode: 400,
  },

  [ApiErrorCode.RATE_LIMIT_EXCEEDED]: {
    code: ApiErrorCode.RATE_LIMIT_EXCEEDED,
    message: "Rate limit exceeded",
    statusCode: 429,
  },

  [ApiErrorCode.REQUEST_TIMEOUT]: {
    code: ApiErrorCode.REQUEST_TIMEOUT,
    message: "Request timeout",
    statusCode: 408,
  },

  // Server errors
  [ApiErrorCode.INTERNAL_SERVER_ERROR]: {
    code: ApiErrorCode.INTERNAL_SERVER_ERROR,
    message: "Internal server error",
    statusCode: 500,
  },

  [ApiErrorCode.SERVICE_UNAVAILABLE]: {
    code: ApiErrorCode.SERVICE_UNAVAILABLE,
    message: "Service unavailable",
    statusCode: 503,
  },

  [ApiErrorCode.DATABASE_ERROR]: {
    code: ApiErrorCode.DATABASE_ERROR,
    message: "Database error",
    statusCode: 500,
  },

  // Business logic errors
  [ApiErrorCode.RESOURCE_NOT_FOUND]: {
    code: ApiErrorCode.RESOURCE_NOT_FOUND,
    message: "Resource not found",
    statusCode: 404,
  },

  [ApiErrorCode.DUPLICATE_RESOURCE]: {
    code: ApiErrorCode.DUPLICATE_RESOURCE,
    message: "Resource already exists",
    statusCode: 409,
  },

  [ApiErrorCode.INVALID_OPERATION]: {
    code: ApiErrorCode.INVALID_OPERATION,
    message: "Invalid operation",
    statusCode: 400,
  },

  [ApiErrorCode.AUTHENTICATION_FAILED]: {
    code: ApiErrorCode.AUTHENTICATION_FAILED,
    message: "Authentication failed",
    statusCode: 401,
  },

  [ApiErrorCode.INSUFFICIENT_PERMISSIONS]: {
    code: ApiErrorCode.INSUFFICIENT_PERMISSIONS,
    message: "Insufficient permissions",
    statusCode: 403,
  },
};

/**
 * Get error details by code
 */
export function getErrorDetails(code: ApiErrorCode): ErrorDetails {
  return API_ERRORS[code] || API_ERRORS[ApiErrorCode.INTERNAL_SERVER_ERROR];
}

/**
 * Get HTTP status code for error
 */
export function getHttpStatusCode(code: ApiErrorCode): number {
  return getErrorDetails(code).statusCode;
}

/**
 * Create standardized error response
 */
export interface StandardErrorResponse {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

export function createErrorResponse(
  errorCode: ApiErrorCode,
  customMessage?: string,
  details?: Record<string, unknown>
): StandardErrorResponse {
  const errorDetails = getErrorDetails(errorCode);

  return {
    success: false,
    error: {
      code: errorCode,
      message: customMessage || errorDetails.message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
}
