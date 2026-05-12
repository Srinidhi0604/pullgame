/**
 * API response utilities and standardized response types
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Create a standardized success response
 */
export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create a standardized error response
 */
export function errorResponse(error: string, message?: string): ApiResponse {
  return {
    success: false,
    error,
    message,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create a paginated response
 */
export function paginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number
): PaginatedResponse<T> {
  return {
    items,
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total,
  };
}

/**
 * Handle API errors with consistent response format
 */
export function handleApiError(error: unknown): ApiResponse {
  if (error instanceof Error) {
    return errorResponse(error.message, "An error occurred");
  }
  return errorResponse("Unknown error", "An unexpected error occurred");
}

/**
 * Create a success response with status code info
 */
export function createdResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    message: "Resource created successfully",
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create a success response for deletion
 */
export function deletedResponse(message = "Resource deleted successfully"): ApiResponse {
  return {
    success: true,
    message,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create a success response for updates
 */
export function updatedResponse<T>(data: T, message = "Resource updated successfully"): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create a not found error response
 */
export function notFoundResponse(resource: string): ApiResponse {
  return {
    success: false,
    error: `${resource} not found`,
    message: `The requested ${resource} does not exist`,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create a validation error response
 */
export function validationErrorResponse(errors: Record<string, string>): ApiResponse {
  return {
    success: false,
    error: "Validation failed",
    message: JSON.stringify(errors),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create an unauthorized error response
 */
export function unauthorizedResponse(message = "Authentication required"): ApiResponse {
  return {
    success: false,
    error: "Unauthorized",
    message,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create a forbidden error response
 */
export function forbiddenResponse(message = "Access denied"): ApiResponse {
  return {
    success: false,
    error: "Forbidden",
    message,
    timestamp: new Date().toISOString(),
  };
}
