export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  metadata?: Record<string, unknown>
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}