/**
 * Pagination and sorting utilities
 */

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortParams {
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Parse pagination parameters from query
 */
export function parsePaginationParams(
  page?: string | number,
  pageSize?: string | number,
  defaults = { page: 1, pageSize: 20 }
): PaginationParams {
  let parsedPage = parseInt(String(page || defaults.page), 10);
  let parsedPageSize = parseInt(String(pageSize || defaults.pageSize), 10);

  // Validate page
  if (isNaN(parsedPage) || parsedPage < 1) {
    parsedPage = defaults.page;
  }

  // Validate page size
  if (isNaN(parsedPageSize) || parsedPageSize < 1 || parsedPageSize > 100) {
    parsedPageSize = defaults.pageSize;
  }

  return {
    page: parsedPage,
    pageSize: parsedPageSize,
  };
}

/**
 * Calculate pagination metadata
 */
export function calculatePaginationMeta(
  page: number,
  pageSize: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / pageSize);

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

/**
 * Calculate skip and limit for database queries
 */
export function calculateSkipLimit(page: number, pageSize: number) {
  return {
    skip: (page - 1) * pageSize,
    limit: pageSize,
  };
}

/**
 * Parse sort parameters from query
 */
export function parseSortParams(
  sortBy?: string,
  sortOrder?: string,
  allowedFields: string[] = []
): SortParams | null {
  if (!sortBy) {
    return null;
  }

  // Validate sortBy is in allowed fields
  if (allowedFields.length > 0 && !allowedFields.includes(sortBy)) {
    return null;
  }

  const order = (sortOrder === "desc" ? "desc" : "asc") as "asc" | "desc";

  return {
    sortBy,
    sortOrder: order,
  };
}

/**
 * Build MongoDB sort object
 */
export function buildMongoSort(sortBy: string, sortOrder: "asc" | "desc") {
  return {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };
}

/**
 * Build SQL ORDER BY clause
 */
export function buildSqlOrderBy(sortBy: string, sortOrder: "asc" | "desc"): string {
  return `ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
}

/**
 * Paginate array in memory
 */
export function paginateArray<T>(
  items: T[],
  page: number,
  pageSize: number
): { items: T[]; meta: PaginationMeta } {
  const total = items.length;
  const { skip, limit } = calculateSkipLimit(page, pageSize);
  const paginatedItems = items.slice(skip, skip + limit);
  const meta = calculatePaginationMeta(page, pageSize, total);

  return {
    items: paginatedItems,
    meta,
  };
}

/**
 * Sort array in memory
 */
export function sortArray<T extends Record<string, unknown>>(
  items: T[],
  sortBy: keyof T,
  sortOrder: "asc" | "desc" = "asc"
): T[] {
  const sorted = [...items];

  sorted.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (aVal === bVal) return 0;
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });

  return sorted;
}

/**
 * Multi-field sort
 */
export function multiSort<T extends Record<string, unknown>>(
  items: T[],
  sortFields: Array<{ field: keyof T; order: "asc" | "desc" }>
): T[] {
  const sorted = [...items];

  sorted.sort((a, b) => {
    for (const { field, order } of sortFields) {
      const aVal = a[field];
      const bVal = b[field];

      if (aVal === bVal) continue;

      if (typeof aVal === "string" && typeof bVal === "string") {
        return order === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return order === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    }

    return 0;
  });

  return sorted;
}

/**
 * Cursor-based pagination (for better performance with large datasets)
 */
export interface CursorPaginationParams {
  cursor?: string;
  limit: number;
}

export interface CursorPaginationResult<T> {
  items: T[];
  nextCursor: string | null;
  haMore: boolean;
}

/**
 * Encode cursor for pagination
 */
export function encodeCursor(id: string): string {
  return Buffer.from(id).toString("base64");
}

/**
 * Decode cursor from pagination
 */
export function decodeCursor(cursor: string): string {
  try {
    return Buffer.from(cursor, "base64").toString("utf-8");
  } catch {
    return "";
  }
}
