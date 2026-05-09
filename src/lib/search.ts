/**
 * Search and filtering utilities
 */

/**
 * Filter items by query string
 */
export function filterByQuery<T extends Record<string, unknown>>(
  items: T[],
  query: string,
  searchFields: (keyof T)[]
): T[] {
  if (!query.trim()) return items;

  const lowerQuery = query.toLowerCase();
  return items.filter((item) =>
    searchFields.some((field) =>
      String(item[field]).toLowerCase().includes(lowerQuery)
    )
  );
}

/**
 * Sort items by field and direction
 */
export function sortByField<T extends Record<string, unknown>>(
  items: T[],
  field: keyof T,
  direction: "asc" | "desc" = "asc"
): T[] {
  return [...items].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal === bVal) return 0;
    const result = aVal > bVal ? 1 : -1;
    return direction === "asc" ? result : -result;
  });
}

/**
 * Paginate array
 */
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): { items: T[]; total: number; hasMore: boolean } {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    items: items.slice(start, end),
    total: items.length,
    hasMore: end < items.length,
  };
}

/**
 * Filter by multiple criteria
 */
export function filterByMultipleCriteria<T extends Record<string, unknown>>(
  items: T[],
  filters: Record<string, unknown>
): T[] {
  return items.filter((item) =>
    Object.entries(filters).every(([key, value]) => {
      if (value === null || value === undefined) return true;
      if (Array.isArray(value)) {
        return value.includes(item[key]);
      }
      return item[key] === value;
    })
  );
}

/**
 * Group items by field
 */
export function groupBy<T extends Record<string, unknown>>(
  items: T[],
  field: keyof T
): Map<unknown, T[]> {
  const grouped = new Map<unknown, T[]>();

  items.forEach((item) => {
    const key = item[field];
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(item);
  });

  return grouped;
}

/**
 * Get unique values from array
 */
export function getUniqueValues<T extends Record<string, unknown>>(
  items: T[],
  field: keyof T
): unknown[] {
  return [...new Set(items.map((item) => item[field]))];
}
