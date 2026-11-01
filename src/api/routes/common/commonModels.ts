// Espelha Pagination<T> / PageInfo / FilterBase da API

export interface PageInfoResponse {
  total: number;
  currentPage: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PaginationResponse<T> {
  pageInfo: PageInfoResponse;
  items: T[];
}

export interface FilterBaseParams {
  PageNumber?: number;
  PageSize?: number;
  Sort?: "asc" | "desc";
}
