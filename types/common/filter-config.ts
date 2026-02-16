export interface FilterConfig {
  searchParam: string;
  statusParam?: string;
  dynamicParams?: Record<string, string>;
}


export interface ApiQueryParams {
  page?: number;
  limit?: number;
  name?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}
