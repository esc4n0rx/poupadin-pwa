import { apiClient } from './api'
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyResetCodeRequest,
  VerifyResetCodeResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '@/types/forgot-password'

export class ForgotPasswordApi {
  static async sendResetCode(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const payload = {
      email: data.email.trim().toLowerCase(),
    }

    return apiClient.post<ForgotPasswordResponse>('/auth/forgot-password', payload)
  }

  static async verifyResetCode(data: VerifyResetCodeRequest): Promise<VerifyResetCodeResponse> {
    const payload = {
      code: data.code.trim(),
    }

    return apiClient.post<VerifyResetCodeResponse>('/auth/verify-reset-code', payload)
  }

  static async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const payload = {
      code: data.code.trim(),
      password: data.password,
    }

    // Validar senha
    if (payload.password.length < 8) {
      throw new Error('A senha deve ter pelo menos 8 caracteres')
    }

    return apiClient.post<ResetPasswordResponse>('/auth/reset-password', payload)
  }
}