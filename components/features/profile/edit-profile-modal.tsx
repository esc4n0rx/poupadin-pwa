"use client"

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AvatarUpload } from './avatar-upload'
import { UserProfile, UpdateProfileRequest } from '@/types/profile'

interface EditProfileModalProps {
  profile: UserProfile
  onClose: () => void
  onSave: (data: UpdateProfileRequest) => Promise<void>
  onUploadAvatar: (file: File) => Promise<void>
  onRemoveAvatar?: () => Promise<void>
}

export function EditProfileModal({ profile, onClose, onSave, onUploadAvatar, onRemoveAvatar }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    bio: profile.bio || '',
    location: profile.location || '',
    website: profile.website || '',
    phone: profile.phone || '',
    privacy_settings: {
      profile_visible: profile.privacy_settings?.profile_visible ?? true,
      email_visible: profile.privacy_settings?.email_visible ?? false,
      phone_visible: profile.privacy_settings?.phone_visible ?? false,
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onSave(formData)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handlePrivacyChange = (field: keyof typeof formData.privacy_settings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      privacy_settings: {
        ...prev.privacy_settings,
        [field]: e.target.checked
      }
    }))
  }

  return (
    <div className="modal-container">
      <div className="modal-content-with-nav">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#2C3E50]">Editar Perfil</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-[#7F8C8D]" />
          </button>
        </div>

        {/* Avatar Upload */}
        <div className="mb-6">
          <AvatarUpload
            currentAvatar={profile.avatar_url}
            onUpload={onUploadAvatar}
            onRemove={onRemoveAvatar}
            loading={loading}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={handleChange('bio')}
              placeholder="Conte um pouco sobre você..."
              className="w-full px-4 py-3 bg-[#E8F8F5] border border-transparent rounded-2xl text-[#2C3E50] placeholder-[#7F8C8D] focus:outline-none focus:ring-2 focus:ring-[#1DD1A1] focus:border-transparent transition-all duration-200 resize-none"
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-[#7F8C8D] mt-1">{formData.bio.length}/500 caracteres</p>
          </div>

          <div>
            <Input
              label="Localização"
              value={formData.location}
              onChange={handleChange('location')}
              placeholder="Ex: São Paulo, SP - Brasil"
            />
          </div>

          <div>
            <Input
              label="Website"
              type="url"
              value={formData.website}
              onChange={handleChange('website')}
              placeholder="https://seusite.com"
            />
          </div>

          <div>
            <Input
              label="Telefone"
              type="tel"
              value={formData.phone}
              onChange={handleChange('phone')}
              placeholder="+55 11 99999-9999"
            />
          </div>

          {/* Configurações de Privacidade */}
          <div>
            <h3 className="text-sm font-medium text-[#2C3E50] mb-3">Configurações de Privacidade</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#2C3E50]">Perfil visível publicamente</span>
                <input
                  type="checkbox"
                  checked={formData.privacy_settings.profile_visible}
                  onChange={handlePrivacyChange('profile_visible')}
                  className="w-4 h-4 text-[#1DD1A1] bg-gray-100 border-gray-300 rounded focus:ring-[#1DD1A1] focus:ring-2"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#2C3E50]">Email visível no perfil</span>
                <input
                  type="checkbox"
                  checked={formData.privacy_settings.email_visible}
                  onChange={handlePrivacyChange('email_visible')}
                  className="w-4 h-4 text-[#1DD1A1] bg-gray-100 border-gray-300 rounded focus:ring-[#1DD1A1] focus:ring-2"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#2C3E50]">Telefone visível no perfil</span>
                <input
                  type="checkbox"
                  checked={formData.privacy_settings.phone_visible}
                  onChange={handlePrivacyChange('phone_visible')}
                  className="w-4 h-4 text-[#1DD1A1] bg-gray-100 border-gray-300 rounded focus:ring-[#1DD1A1] focus:ring-2"
                />
              </div>
            </div>
          </div>

          <div className="modal-actions-sticky">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1" disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" loading={loading}>
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}