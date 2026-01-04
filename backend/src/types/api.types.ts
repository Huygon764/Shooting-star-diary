// API Response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

// Pagination
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}
