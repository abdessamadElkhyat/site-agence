export const ADMIN_PAGE_SIZE = 10;

export function parsePage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(raw || "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export function getPagination(total: number, page: number, pageSize = ADMIN_PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, totalPages);
  const skip = (current - 1) * pageSize;
  return {
    page: current,
    pageSize,
    total,
    totalPages,
    skip,
    take: pageSize,
    from: total === 0 ? 0 : skip + 1,
    to: Math.min(skip + pageSize, total),
  };
}

export function pageHref(basePath: string, page: number, params?: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value) search.set(key, value);
    }
  }
  if (page > 1) search.set("page", String(page));
  const query = search.toString();
  return query ? `${basePath}?${query}` : basePath;
}
