// components/features/profile/avatar-upload.tsx
"use client"

import { useRef, useState } from 'react'
import { Camera, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AvatarUploadProps {
  currentAvatar?: string | null
  onUpload: (file: File) => Promise<void>
  onRemove?: () => Promise<void>
  loading?: boolean
}

export function AvatarUpload({ currentAvatar, onUpload, onRemove, loading }: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.')
      return
    }

    // Validar tamanho (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande. Tamanho máximo: 5MB')
      return
    }

    setUploading(true)
    try {
      await onUpload(file)
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      alert(error instanceof Error ? error.message : 'Erro ao fazer upload do avatar')
    } finally {
      setUploading(false)
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = async () => {
    if (!onRemove) return

    setRemoving(true)
    try {
      await onRemove()
    } catch (error) {
      console.error('Erro ao remover avatar:', error)
      alert(error instanceof Error ? error.message : 'Erro ao remover avatar')
    } finally {
      setRemoving(false)
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="relative">
      {/* Avatar Display */}
      <div className="relative w-24 h-24 mx-auto mb-4">
        {currentAvatar ? (
          <img
            src={currentAvatar}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
            <span className="text-2xl text-gray-400">👤</span>
          </div>
        )}
        
        {/* Camera Button */}
        <button
          onClick={triggerFileSelect}
          disabled={uploading || loading}
          className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#1DD1A1] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#00A085] transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Remove Button */}
      {currentAvatar && onRemove && (
        <div className="text-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRemove}
            loading={removing}
            disabled={uploading || loading}
            className="text-red-500 hover:text-red-600"
          >
            <X className="w-4 h-4 mr-1" />
            Remover Avatar
          </Button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}