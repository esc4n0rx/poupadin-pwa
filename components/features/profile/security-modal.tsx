"use client"

import React, { useState } from 'react'
import { X, Shield, Key, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChangePasswordRequest } from '@/types/profile'
import { useAuth } from '@/contexts/auth-context'

interface SecurityModalProps {
  onClose: () => void
  onChangePassword: (data: ChangePasswordRequest) => Promise<{ logoutRequired: boolean }>
}

export function SecurityModal({ onClose, onChangePassword }: SecurityModalProps) {
  const [activeTab, setActiveTab] = useState<'password' | 'sessions'>('password')
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { logout } = useAuth()

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (formData.new_password !== formData.confirm_password) {
      setError('As senhas não coincidem')
      return
    }

    if (formData.new_password.length < 8) {
      setError('A nova senha deve ter pelo menos 8 caracteres')
      return
    }

    setLoading(true)
    try {
      const result = await onChangePassword(formData)
      setSuccess('Senha alterada com sucesso!')
      
      if (result.logoutRequired) {
        setTimeout(() => {
          logout()
          onClose()
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar senha')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <div className="modal-container">
      <div className="modal-content-with-nav">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#2C3E50]">Segurança</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-[#7F8C8D]" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-2xl p-1">
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
              activeTab === 'password'
                ? 'bg-white text-[#1DD1A1] shadow-sm'
                : 'text-[#7F8C8D]'
            }`}
          >
            <Key className="w-4 h-4 inline mr-2" />
            Senha
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
              activeTab === 'sessions'
                ? 'bg-white text-[#1DD1A1] shadow-sm'
                : 'text-[#7F8C8D]'
            }`}
          >
            <Shield className="w-4 h-4 inline mr-2" />
            Sessões
          </button>
        </div>

        {activeTab === 'password' ? (
          <form onSubmit={handlePasswordChange} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            <div>
              <Input
                label="Senha Atual"
                type="password"
                value={formData.current_password}
                onChange={handleChange('current_password')}
                placeholder="Digite sua senha atual"
                required
              />
            </div>

            <div>
              <Input
                label="Nova Senha"
                type="password"
                value={formData.new_password}
                onChange={handleChange('new_password')}
                placeholder="Digite a nova senha"
                minLength={8}
                required
              />
            </div>

            <div>
              <Input
                label="Confirmar Nova Senha"
                type="password"
                value={formData.confirm_password}
                onChange={handleChange('confirm_password')}
                placeholder="Confirme a nova senha"
                required
              />
            </div>

            <div className="modal-actions-sticky">
              <Button type="button" variant="secondary" onClick={onClose} className="flex-1" disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" loading={loading}>
                Alterar Senha
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-2xl">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xs font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Sessão Atual</h4>
                  <p className="text-sm text-blue-700">Este dispositivo • Agora</p>
                </div>
              </div>
              <p className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block">
                Ativo
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl">
              <h4 className="font-medium text-[#2C3E50] mb-2">Gerenciar Sessões</h4>
              <p className="text-sm text-[#7F8C8D] mb-4">
                Para sua segurança, você pode encerrar todas as outras sessões ativas em outros dispositivos.
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  // TODO: Implementar logout de outras sessões
                  console.log('Encerrar outras sessões')
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Encerrar Outras Sessões
              </Button>
            </div>

            <div className="modal-actions-sticky">
              <Button onClick={onClose} className="w-full">
                Fechar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}