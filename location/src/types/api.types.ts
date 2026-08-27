// Common API response types

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}
