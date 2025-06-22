export interface ApiResponse<T = any> {
  data?: T
  message?: string
  errors?: string[]
}

export interface ApiError {
  message: string
  code?: string
  errors?: string[]
  status: number
}

export class ApiException extends Error {
  public status: number
  public code?: string
  public errors?: string[]

  constructor(error: ApiError) {
    super(error.message)
    this.name = 'ApiException'
    this.status = error.status
    this.code = error.code
    this.errors = error.errors
  }
}