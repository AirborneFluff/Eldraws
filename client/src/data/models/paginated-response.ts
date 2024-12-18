export interface Pagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}
