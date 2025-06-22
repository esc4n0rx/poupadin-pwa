export interface User {
  id: string
  name: string
  email: string
  date_of_birth: string
  initial_setup_completed: boolean
  created_at?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  date_of_birth: string // Formato: YYYY-MM-DD
}

export interface AuthResponse {
  message: string
  accessToken: string
  refreshToken: string
  user: User
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface LogoutRequest {
  refreshToken: string
}

export interface TokenStatusResponse {
  userId: string
  activeRefreshTokens: number
  maxTokensAllowed: number
}

export interface AuthError {
  message: string
  code?: string
  errors?: string[]
}