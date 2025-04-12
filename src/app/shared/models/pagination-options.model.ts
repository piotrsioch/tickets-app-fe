export interface PaginationOptions {
  page: number;
  limit: number;
  orderField?: string;
  orderDirection?: 'ASC' | 'DESC';
  search?: string;
  searchFields?: string[];
  where?: Record<string, unknown>;
}
