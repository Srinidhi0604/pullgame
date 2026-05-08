/**
 * Application-wide constants and configuration values
 */

// Authentication & Security
export const AUTH_CONSTANTS = {
  JWT_EXPIRY: "7d",
  SESSION_TIMEOUT_MS: 24 * 60 * 60 * 1000, // 24 hours
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_SALT_ROUNDS: 10,
} as const;

// API Configuration
export const API_CONSTANTS = {
  DEFAULT_TIMEOUT_MS: 30000,
  MAX_REQUEST_SIZE_MB: 10,
  RATE_LIMIT_REQUESTS: 100,
  RATE_LIMIT_WINDOW_MS: 60000, // 1 minute
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 5,
} as const;

// Domain Categories
export const DOMAINS = {
  ML: "machine-learning",
  BIOLOGY: "biology",
  CHEMISTRY: "chemistry",
  ELECTRICAL_ENGINEERING: "electrical-engineering",
} as const;

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
  EXPERT: "expert",
} as const;

// Pyodide Configuration
export const PYODIDE_CONFIG = {
  VERSION: "0.29.3",
  PACKAGES: ["numpy", "pandas", "scipy", "matplotlib"],
  TIMEOUT_MS: 30000,
} as const;

// UI Constants
export const UI_CONSTANTS = {
  TOAST_DURATION_MS: 3000,
  ANIMATION_DURATION_MS: 300,
  DEBOUNCE_DELAY_MS: 300,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized access",
  NOT_FOUND: "Resource not found",
  INVALID_INPUT: "Invalid input provided",
  SERVER_ERROR: "Internal server error",
  NETWORK_ERROR: "Network error occurred",
} as const;
