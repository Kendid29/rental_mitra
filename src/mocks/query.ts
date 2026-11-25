import { PaginatedResponse, PaginationParams } from '@/types';

export function paginate<T>(items: T[], page = 1, limit = 10): PaginatedResponse<T> {
  const total = items.length;
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const totalPages = Math.ceil(total / safeLimit) || 1;
  const start = (safePage - 1) * safeLimit;
  const paginatedItems = items.slice(start, start + safeLimit);

  return {
    items: paginatedItems,
    total,
    page: safePage,
    limit: safeLimit,
    totalPages,
  };
}

export const paginateList = paginate;

export function sortItems<T>(items: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...items].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    if (valA === undefined || valA === null) return order === 'asc' ? 1 : -1;
    if (valB === undefined || valB === null) return order === 'asc' ? -1 : 1;

    if (typeof valA === 'number' && typeof valB === 'number') {
      return order === 'asc' ? valA - valB : valB - valA;
    }

    const strA = String(valA).toLowerCase();
    const strB = String(valB).toLowerCase();

    return order === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
  });
}
