export interface User {
  id: string
  name: string
  email: string
  date_of_birth: string
  initial_setup_completed: boolean
  created_at: string
  updated_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  date_of_birth: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface TokenStatusResponse {
  valid: boolean
  user?: User
}

export interface LogoutRequest {
  refreshToken: string
}