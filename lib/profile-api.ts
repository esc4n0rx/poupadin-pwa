// lib/profile-api.ts
import { apiClient } from './api'
import { ProfileResponse, UpdateProfileRequest, ChangePasswordRequest, AvatarUploadResponse } from '@/types/profile'

export class ProfileApi {
  static async getProfile(): Promise<ProfileResponse> {
    return apiClient.get<ProfileResponse>('/profile', true)
  }

  static async updateProfile(data: UpdateProfileRequest): Promise<ProfileResponse> {
    return apiClient.put<ProfileResponse>('/profile', data, true)
  }

  static async uploadAvatar(file: File): Promise<AvatarUploadResponse> {
    const formData = new FormData()
    formData.append('avatar', file)

    // Para FormData, não definimos Content-Type para deixar o browser definir automaticamente
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.poupadin.space/api'}/profile/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('poupadin_access_token')}`
      },
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Erro ao fazer upload do avatar')
    }

    return response.json()
  }

  static async removeAvatar(): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>('/profile/avatar', true)
  }

  static async changePassword(data: ChangePasswordRequest): Promise<{ message: string; success: boolean; logoutRequired: boolean }> {
    return apiClient.post<{ message: string; success: boolean; logoutRequired: boolean }>('/profile/reset-password', data, true)
  }
}