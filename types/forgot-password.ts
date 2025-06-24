// types/forgot-password.ts
export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
  instruction: string
}

export interface VerifyResetCodeRequest {
  code: string
}

export interface VerifyResetCodeResponse {
  message: string
  valid: boolean
}

export interface ResetPasswordRequest {
  code: string
  password: string
}

export interface ResetPasswordResponse {
  message: string
  success: boolean
}

export type ForgotPasswordStep = 'email' | 'verify-code' | 'reset-password' | 'success'

export interface ForgotPasswordState {
  step: ForgotPasswordStep
  email: string
  code: string
  isLoading: boolean
  error: string
}