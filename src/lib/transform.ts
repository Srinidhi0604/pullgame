/**
 * Data transformation and mapping utilities
 */

/**
 * Transform object keys (camelCase <-> snake_case)
 */
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert object keys
 */
export function objectToSnakeCase<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = toSnakeCase(key);
    result[snakeKey] = typeof value === "object" && value !== null && !Array.isArray(value)
      ? objectToSnakeCase(value as Record<string, unknown>)
      : value;
  }

  return result;
}

export function objectToCamelCase<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const camelKey = toCamelCase(key);
    result[camelKey] = typeof value === "object" && value !== null && !Array.isArray(value)
      ? objectToCamelCase(value as Record<string, unknown>)
      : value;
  }

  return result;
}

/**
 * Flatten nested object
 */
export function flattenObject<T extends Record<string, unknown>>(
  obj: T,
  prefix = ""
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
    } else {
      result[newKey] = value;
    }
  }

  return result;
}

/**
 * Unflatten object
 */
export function unflattenObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const keys = key.split(".");
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current)) {
        current[k] = {};
      }
      current = current[k] as Record<string, unknown>;
    }

    current[keys[keys.length - 1]] = value;
  }

  return result;
}

/**
 * Pick specific keys from object
 */
export function pick<T extends Record<string, unknown>>(
  obj: T,
  keys: (keyof T)[]
): Partial<T> {
  const result: Partial<T> = {};

  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }

  return result;
}

/**
 * Omit specific keys from object
 */
export function omit<T extends Record<string, unknown>>(
  obj: T,
  keys: (keyof T)[]
): Partial<T> {
  const result = { ...obj };
  const keysSet = new Set(keys);

  for (const key of keysSet) {
    delete result[key];
  }

  return result;
}

/**
 * Map array of objects to specific shape
 */
export function mapArray<T extends Record<string, unknown>, R>(
  items: T[],
  mapper: (item: T) => R
): R[] {
  return items.map(mapper);
}

/**
 * Group array by key
 */
export function groupBy<T extends Record<string, unknown>>(
  items: T[],
  key: keyof T
): Map<unknown, T[]> {
  const groups = new Map<unknown, T[]>();

  for (const item of items) {
    const groupKey = item[key];
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)!.push(item);
  }

  return groups;
}

/**
 * Deduplicate array by key
 */
export function deduplicateBy<T extends Record<string, unknown>>(
  items: T[],
  key: keyof T
): T[] {
  const seen = new Set<unknown>();
  const result: T[] = [];

  for (const item of items) {
    const value = item[key];
    if (!seen.has(value)) {
      seen.add(value);
      result.push(item);
    }
  }

  return result;
}

/**
 * Transform array values
 */
export function transformValues<T extends Record<string, unknown>, R>(
  obj: T,
  transformer: (value: unknown) => R
): Record<keyof T, R> {
  const result: Record<string, R> = {};

  for (const [key, value] of Object.entries(obj)) {
    result[key] = transformer(value);
  }

  return result as Record<keyof T, R>;
}

/**
 * Merge objects deeply
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      typeof result[key] === "object" &&
      result[key] !== null &&
      !Array.isArray(result[key])
    ) {
      result[key as keyof T] = deepMerge(
        result[key as keyof T] as Record<string, unknown>,
        value as Record<string, unknown>
      ) as never;
    } else {
      result[key as keyof T] = value as never;
    }
  }

  return result;
}

/**
 * Clone object deeply
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as never;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as never;
  }

  if (obj instanceof Object) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = deepClone(value);
    }
    return result as never;
  }

  return obj;
}

/**
 * Zip arrays together
 */
export function zip<T, U>(a: T[], b: U[]): Array<[T, U]> {
  const length = Math.min(a.length, b.length);
  const result: Array<[T, U]> = [];

  for (let i = 0; i < length; i++) {
    result.push([a[i], b[i]]);
  }

  return result;
}

/**
 * Transpose 2D array
 */
export function transpose<T>(matrix: T[][]): T[][] {
  if (matrix.length === 0) return [];

  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}
