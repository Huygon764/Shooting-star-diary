// Generic API response
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

// Error response
export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}
