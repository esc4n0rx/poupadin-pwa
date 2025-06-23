// hooks/use-profile.ts
"use client"

import { useState, useEffect } from 'react'
import { ProfileApi } from '@/lib/profile-api'
import { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '@/types/profile'

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await ProfileApi.getProfile()
      setProfile(response.profile)
    } catch (err) {
      console.error('Erro ao carregar perfil:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar perfil')
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: UpdateProfileRequest) => {
    try {
      const response = await ProfileApi.updateProfile(data)
      setProfile(response.profile)
      return response
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      throw error
    }
  }

  const uploadAvatar = async (file: File) => {
    try {
      const response = await ProfileApi.uploadAvatar(file)
      // Recarregar perfil para obter a nova URL do avatar
      await fetchProfile()
      return response
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error)
      throw error
    }
  }

  const removeAvatar = async () => {
    try {
      const response = await ProfileApi.removeAvatar()
      // Recarregar perfil para refletir a remoção
      await fetchProfile()
      return response
    } catch (error) {
      console.error('Erro ao remover avatar:', error)
      throw error
    }
  }

  const changePassword = async (data: ChangePasswordRequest) => {
    try {
      const response = await ProfileApi.changePassword(data)
      return response
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
      throw error
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    removeAvatar,
    changePassword,
    refetch: fetchProfile
  }
}