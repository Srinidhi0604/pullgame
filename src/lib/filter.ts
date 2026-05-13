/**
 * Advanced search and filtering utilities
 */

export interface FilterCriteria {
  [key: string]: unknown;
}

export interface SearchOptions {
  caseSensitive: boolean;
  fuzzy: boolean;
  fields: string[];
}

/**
 * Build MongoDB filter query
 */
export function buildFilterQuery(filters: FilterCriteria): Record<string, unknown> {
  const query: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(filters)) {
    if (value === null || value === undefined) continue;

    // Handle range queries
    if (typeof value === "object" && !Array.isArray(value)) {
      query[key] = value;
    } else if (Array.isArray(value)) {
      // Handle array values
      query[key] = { $in: value };
    } else {
      query[key] = value;
    }
  }

  return query;
}

/**
 * Build text search query
 */
export function buildTextSearchQuery(
  searchTerm: string,
  fields: string[]
): Record<string, unknown> {
  if (!searchTerm.trim()) {
    return {};
  }

  const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(escapedTerm, "i");

  return {
    $or: fields.map((field) => ({
      [field]: pattern,
    })),
  };
}

/**
 * Simple string search
 */
export function searchInArray<T extends Record<string, unknown>>(
  items: T[],
  searchTerm: string,
  fields: (keyof T)[],
  caseSensitive = false
): T[] {
  if (!searchTerm.trim()) {
    return items;
  }

  const term = caseSensitive ? searchTerm : searchTerm.toLowerCase();

  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      const stringValue = String(value).toLowerCase();
      return stringValue.includes(term);
    })
  );
}

/**
 * Fuzzy search
 */
export function fuzzySearch<T extends Record<string, unknown>>(
  items: T[],
  searchTerm: string,
  fields: (keyof T)[]
): T[] {
  if (!searchTerm.trim()) {
    return items;
  }

  const term = searchTerm.toLowerCase();

  return items.filter((item) =>
    fields.some((field) => {
      const value = String(item[field]).toLowerCase();
      let termIndex = 0;

      for (let i = 0; i < value.length && termIndex < term.length; i++) {
        if (value[i] === term[termIndex]) {
          termIndex++;
        }
      }

      return termIndex === term.length;
    })
  );
}

/**
 * Filter array by multiple criteria
 */
export function filterByMultipleCriteria<T extends Record<string, unknown>>(
  items: T[],
  criteria: Partial<T>
): T[] {
  return items.filter((item) =>
    Object.entries(criteria).every(([key, value]) => {
      if (value === null || value === undefined) return true;

      if (Array.isArray(value)) {
        return value.includes(item[key as keyof T]);
      }

      return item[key as keyof T] === value;
    })
  );
}

/**
 * Range filter
 */
export function filterByRange<T extends Record<string, unknown>>(
  items: T[],
  field: keyof T,
  min?: number,
  max?: number
): T[] {
  return items.filter((item) => {
    const value = item[field];
    if (typeof value !== "number") return true;

    if (min !== undefined && value < min) return false;
    if (max !== undefined && value > max) return false;

    return true;
  });
}

/**
 * Date range filter
 */
export function filterByDateRange<T extends Record<string, unknown>>(
  items: T[],
  field: keyof T,
  startDate?: Date,
  endDate?: Date
): T[] {
  return items.filter((item) => {
    const value = item[field];
    if (!(value instanceof Date) && typeof value !== "string") return true;

    const itemDate = value instanceof Date ? value : new Date(value as string);

    if (startDate && itemDate < startDate) return false;
    if (endDate && itemDate > endDate) return false;

    return true;
  });
}

/**
 * Filter by inclusion
 */
export function filterByInclusion<T extends Record<string, unknown>>(
  items: T[],
  field: keyof T,
  values: unknown[]
): T[] {
  return items.filter((item) => values.includes(item[field]));
}

/**
 * Filter by exclusion
 */
export function filterByExclusion<T extends Record<string, unknown>>(
  items: T[],
  field: keyof T,
  values: unknown[]
): T[] {
  return items.filter((item) => !values.includes(item[field]));
}

/**
 * Build complex MongoDB query from filter object
 */
export interface AdvancedFilterOptions {
  $and?: FilterCriteria[];
  $or?: FilterCriteria[];
  $nor?: FilterCriteria[];
}

export function buildAdvancedQuery(filters: AdvancedFilterOptions): Record<string, unknown> {
  const query: Record<string, unknown> = {};

  if (filters.$and) {
    query.$and = filters.$and.map(buildFilterQuery);
  }

  if (filters.$or) {
    query.$or = filters.$or.map(buildFilterQuery);
  }

  if (filters.$nor) {
    query.$nor = filters.$nor.map(buildFilterQuery);
  }

  return query;
}

/**
 * Combine multiple filters
 */
export function combineFilters<T extends Record<string, unknown>>(
  items: T[],
  ...filters: Array<(items: T[]) => T[]>
): T[] {
  return filters.reduce((result, filter) => filter(result), items);
}

/**
 * Create filter predicate
 */
export function createFilterPredicate<T extends Record<string, unknown>>(
  criteria: Partial<T>
): (item: T) => boolean {
  return (item) =>
    Object.entries(criteria).every(([key, value]) => {
      if (value === null || value === undefined) return true;
      return item[key as keyof T] === value;
    });
}

/**
 * Get filter statistics
 */
export function getFilterStats<T extends Record<string, unknown>>(
  items: T[],
  field: keyof T
): Record<string, number> {
  const stats: Record<string, number> = {};

  for (const item of items) {
    const value = String(item[field]);
    stats[value] = (stats[value] || 0) + 1;
  }

  return stats;
}
