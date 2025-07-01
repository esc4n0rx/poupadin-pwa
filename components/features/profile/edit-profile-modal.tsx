"use client"

import React, { useEffect, useState } from 'react'
import { X, Camera, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AvatarUpload } from './avatar-upload'
import { UserProfile, UpdateProfileRequest } from '@/types/profile'
import { useUIStore } from '@/hooks/use-ui-store'

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

  useEffect(() => {
        useUIStore.getState().openModal();
        return () => {
          useUIStore.getState().closeModal();
        };
      }, []);

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

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (error) setError('')
  }

  const handlePrivacyChange = (field: keyof typeof formData.privacy_settings) => {
    setFormData(prev => ({
      ...prev,
      privacy_settings: {
        ...prev.privacy_settings,
        [field]: !prev.privacy_settings[field]
      }
    }))
  }

  return (
    <div className="modal-overlay">
      <div className="modal-popup">
        <div className="modal-header">
          <h2 className="text-xl font-bold text-[#2C3E50]">Editar Perfil</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-[#7F8C8D]" />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Avatar Section */}
            <div className="text-center">
              <div className="relative inline-block mb-4">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <User className="w-8 h-8 text-white" />
                  </div>
                )}
                <AvatarUpload onUpload={onUploadAvatar} onRemove={onRemoveAvatar} />
                <button
                  type="button"
                  className="absolute bottom-0 right-0 w-6 h-6 bg-[#1DD1A1] rounded-full flex items-center justify-center shadow-lg hover:bg-[#00A085] transition-colors"
                  onClick={() => {
                    // You may want to expose a ref or callback from AvatarUpload to trigger file input
                    // For now, this is a placeholder for triggering the upload dialog
                  }}
                >
                  <Camera className="w-3 h-3 text-white" />
                </button>
              </div>
              <p className="text-sm text-[#7F8C8D]">Toque para alterar foto</p>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Input
                  label="Bio"
                  value={formData.bio}
                  onChange={handleChange('bio')}
                  placeholder="Conte um pouco sobre você..."
                  maxLength={200}
                />
                <p className="text-xs text-[#7F8C8D] mt-1">
                  {formData.bio.length}/200 caracteres
                </p>
              </div>

              <div>
                <Input
                  label="Localização"
                  value={formData.location}
                  onChange={handleChange('location')}
                  placeholder="Ex: São Paulo, SP"
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
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            {/* Privacy Settings */}
            <div>
              <h3 className="text-sm font-medium text-[#2C3E50] mb-3">Configurações de Privacidade</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#2C3E50]">Perfil público</span>
                  <button
                    type="button"
                    onClick={() => handlePrivacyChange('profile_visible')}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      formData.privacy_settings.profile_visible ? 'bg-[#1DD1A1]' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      formData.privacy_settings.profile_visible ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#2C3E50]">Email visível</span>
                  <button
                    type="button"
                    onClick={() => handlePrivacyChange('email_visible')}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      formData.privacy_settings.email_visible ? 'bg-[#1DD1A1]' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      formData.privacy_settings.email_visible ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#2C3E50]">Telefone visível</span>
                  <button
                    type="button"
                    onClick={() => handlePrivacyChange('phone_visible')}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      formData.privacy_settings.phone_visible ? 'bg-[#1DD1A1]' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      formData.privacy_settings.phone_visible ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose} 
            className="flex-1"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            className="flex-1"
            loading={loading}
          >
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  )
}