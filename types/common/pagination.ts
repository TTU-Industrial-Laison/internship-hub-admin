
 interface PaginationMeta {
  total: number;
  page: number;
  lastPage: number;
  limit: number;
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
