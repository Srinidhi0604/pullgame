/**
 * Environment and configuration utilities
 */

/**
 * Get environment variable with fallback
 */
export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value || defaultValue || "";
}

/**
 * Get environment variable as boolean
 */
export function getEnvBool(key: string, defaultValue: boolean = false): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return ["true", "1", "yes", "on"].includes(value.toLowerCase());
}

/**
 * Get environment variable as number
 */
export function getEnvNumber(key: string, defaultValue: number = 0): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Check if running in test environment
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === "test";
}

/**
 * Get API base URL
 */
export function getApiBaseUrl(): string {
  if (isProduction()) {
    return getEnvVar("API_BASE_URL_PROD");
  }
  return getEnvVar("API_BASE_URL_DEV", "http://localhost:3000");
}

/**
 * Get application config object
 */
export function getAppConfig() {
  return {
    nodeEnv: process.env.NODE_ENV || "development",
    apiPort: getEnvNumber("API_PORT", 3000),
    apiBaseUrl: getApiBaseUrl(),
    isDev: isDevelopment(),
    isProd: isProduction(),
    isTest: isTest(),
    mongodbUri: getEnvVar("MONGODB_URI", "mongodb://localhost:27017/paperlabs"),
    jwtSecret: getEnvVar("JWT_SECRET"),
  } as const;
}

/**
 * Validate required environment variables
 */
export function validateRequiredEnvVars(keys: string[]): void {
  const missing = keys.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}
