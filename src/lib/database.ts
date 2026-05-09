/**
 * Database query helpers and utilities
 */

/**
 * Build MongoDB query filters
 */
export function buildMongoQuery(filters: Record<string, unknown>): Record<string, unknown> {
  const query: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(filters)) {
    if (value === null || value === undefined) {
      continue;
    }

    if (typeof value === "string" && value.includes("*")) {
      // Handle wildcard search
      const pattern = value.replace(/\*/g, ".*");
      query[key] = { $regex: pattern, $options: "i" };
    } else if (Array.isArray(value)) {
      query[key] = { $in: value };
    } else if (typeof value === "object" && value instanceof Object) {
      query[key] = value;
    } else {
      query[key] = value;
    }
  }

  return query;
}

/**
 * Build MongoDB sort object
 */
export function buildMongoSort(
  sortBy: string,
  direction: "asc" | "desc" = "asc"
): Record<string, 1 | -1> {
  return { [sortBy]: direction === "asc" ? 1 : -1 };
}

/**
 * Build MongoDB aggregation pipeline stage
 */
export function buildAggregationMatch(
  filters: Record<string, unknown>
): { $match: Record<string, unknown> } {
  return {
    $match: buildMongoQuery(filters),
  };
}

/**
 * Format MongoDB ObjectId
 */
export function formatObjectId(id: unknown): string {
  if (typeof id === "object" && id !== null && "toString" in id) {
    return (id as { toString(): string }).toString();
  }
  return String(id);
}

/**
 * Ensure index exists on collection
 */
export async function ensureIndex(
  collection: { createIndex: (index: Record<string, 1 | -1>) => Promise<void> },
  fields: Record<string, 1 | -1>
): Promise<void> {
  try {
    await collection.createIndex(fields);
  } catch (error) {
    // Index may already exist, which is fine
    console.warn("Could not create index:", error);
  }
}

/**
 * Build text search query
 */
export function buildTextSearch(query: string): Record<string, unknown> {
  return {
    $text: { $search: query },
  };
}

/**
 * Batch database operations
 */
export async function batchProcess<T, R>(
  items: T[],
  processor: (batch: T[]) => Promise<R[]>,
  batchSize: number = 100
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await processor(batch);
    results.push(...batchResults);
  }

  return results;
}
