// components/features/profile/profile-screen.tsx
"use client"

import { useState } from 'react'
import { User, Shield, Settings, Info, ChevronRight, LogOut, Camera } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BottomNavigation } from '@/components/features/navigation/bottom-navigation'
import { EditProfileModal } from './edit-profile-modal'
import { SecurityModal } from './security-modal'
import { SettingsModal } from './settings-modal'
import { AboutModal } from './about-modal'
import { useProfile } from '@/hooks/use-profile'
import { useAuth } from '@/contexts/auth-context'

export function ProfileScreen() {
  const { user, logout } = useAuth()
  const { 
    profile, 
    loading, 
    error, 
    updateProfile, 
    uploadAvatar, 
    removeAvatar, 
    changePassword 
  } = useProfile()
  
  const [activeModal, setActiveModal] = useState<'edit' | 'security' | 'settings' | 'about' | null>(null)
  

  
  const handleLogout = () => {
    logout()
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1DD1A1] to-[#00A085] flex items-center justify-center">
        <div className="text-white text-lg">Carregando perfil...</div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1DD1A1] to-[#00A085] flex items-center justify-center p-6">
        <Card className="p-6 text-center max-w-md">
          <h2 className="text-lg font-bold text-red-600 mb-2">Erro ao Carregar Perfil</h2>
          <p className="text-gray-600 mb-4">{error || 'Erro desconhecido'}</p>
          <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1DD1A1] to-[#00A085] pb-20">
      {/* Header com Avatar */}
      <div className="p-6 text-white text-center">
        <div className="relative inline-block mb-4">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white shadow-lg flex items-center justify-center mx-auto">
              <span className="text-4xl">👤</span>
            </div>
          )}
          
          {/* Indicador de edição */}
          <button
            onClick={() => setActiveModal('edit')}
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-white text-[#1DD1A1] rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-1">{profile.name}</h1>
        <p className="text-white/80 text-sm">
          {profile.bio || 'Adicione uma bio ao seu perfil'}
        </p>
      </div>

      {/* Menu de Opções */}
      <div className="bg-[#F0F4F3] rounded-t-3xl min-h-[60vh] p-6">
        <div className="space-y-4">
          {/* Editar Perfil */}
          <button
            onClick={() => setActiveModal('edit')}
            className="w-full"
          >
            <Card className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#E8F8F5] rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-[#1DD1A1]" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-[#2C3E50]">Editar Perfil</h3>
                  <p className="text-sm text-[#7F8C8D]">Altere suas informações pessoais</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#7F8C8D]" />
              </div>
            </Card>
          </button>

          {/* Segurança */}
          <button
            onClick={() => setActiveModal('security')}
            className="w-full"
          >
            <Card className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-[#2C3E50]">Segurança</h3>
                  <p className="text-sm text-[#7F8C8D]">Alterar senha e configurações de segurança</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#7F8C8D]" />
              </div>
            </Card>
          </button>

          {/* Configurações */}
          <button
            onClick={() => setActiveModal('settings')}
            className="w-full"
          >
            <Card className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-[#2C3E50]">Configurações</h3>
                  <p className="text-sm text-[#7F8C8D]">Ajustes de tema, notificações e preferências</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#7F8C8D]" />
              </div>
            </Card>
          </button>

          {/* Sobre */}
          <button
            onClick={() => setActiveModal('about')}
            className="w-full"
          >
            <Card className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Info className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-[#2C3E50]">Sobre</h3>
                  <p className="text-sm text-[#7F8C8D]">Informações do app e suporte</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#7F8C8D]" />
              </div>
            </Card>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full"
          >
            <Card className="p-4 hover:bg-red-50 transition-colors border-red-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <LogOut className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-red-600">Sair</h3>
                  <p className="text-sm text-red-400">Desconectar da conta</p>
                </div>
                <ChevronRight className="w-5 h-5 text-red-400" />
              </div>
            </Card>
          </button>
        </div>
      </div>

      <BottomNavigation />

      {/* Modais */}
      {activeModal === 'edit' && (
        <EditProfileModal
          profile={profile}
          onClose={closeModal}
          onSave={async (data) => { await updateProfile(data); }}
          onUploadAvatar={async (file) => { await uploadAvatar(file); }}
          onRemoveAvatar={removeAvatar ? async () => { await removeAvatar(); } : undefined}
        />
      )}

      {activeModal === 'security' && (
        <SecurityModal
          onClose={closeModal}
          onChangePassword={changePassword}
        />
      )}

      {activeModal === 'settings' && (
        <SettingsModal
          onClose={closeModal}
        />
      )}

      {activeModal === 'about' && (
        <AboutModal
          onClose={closeModal}
        />
      )}
    </div>
  )
}