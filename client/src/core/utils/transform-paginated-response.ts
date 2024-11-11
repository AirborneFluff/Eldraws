import { PaginatedResponse, Pagination } from '../../data/models/paginated-response.ts';

interface MetaData {
  headers: Headers;
}

const transformPaginatedResponse = <T>(
  baseQueryReturnValue: T[],
  meta: MetaData
): PaginatedResponse<T> => {
  const items = baseQueryReturnValue;

  const paginationHeader: Pagination = JSON.parse(meta.headers.get('Pagination') || '{}');
  const pagination: Pagination = {
    totalCount: paginationHeader.totalCount,
    pageSize: paginationHeader.pageSize,
    currentPage: paginationHeader.currentPage,
    totalPages: paginationHeader.totalPages,
  };

  return { items, pagination };
};

export const createTransformPaginatedResponse = <T>() => (response: T[], meta: { response: Response }) => {
  return transformPaginatedResponse(response, { headers: meta.response.headers });
};