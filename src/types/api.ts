// types/api.ts
export interface PaginationParams {
  skip?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
  year?: string;
  month?: string;
  financial_year?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  total: number;
  items: T[];
}