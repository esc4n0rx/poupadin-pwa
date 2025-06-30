"use client"

import React, { useState } from 'react'
import { X, Shield, Eye, EyeOff, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SecurityModalProps {
  onClose: () => void
  onChangePassword: (oldPassword: string, newPassword: string) => Promise<void>
}

export function SecurityModal({ onClose, onChangePassword }: SecurityModalProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.currentPassword) {
      setError('Senha atual é obrigatória')
      return
    }

    if (!formData.newPassword) {
      setError('Nova senha é obrigatória')
      return
    }

    if (formData.newPassword.length < 6) {
      setError('Nova senha deve ter pelo menos 6 caracteres')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Confirmação de senha não confere')
      return
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('A nova senha deve ser diferente da atual')
      return
    }

    setLoading(true)
    try {
      await onChangePassword(formData.currentPassword, formData.newPassword)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar senha')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (error) setError('')
  }

  const toggleShowPassword = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  return (
    <div className="modal-overlay">
      <div className="modal-popup">
        <div className="modal-header">
          <h2 className="text-xl font-bold text-[#2C3E50] flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Segurança
          </h2>
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

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-2">Senha Atual</label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleChange('currentPassword')}
                  className="w-full px-4 py-3 pr-12 bg-[#E8F8F5] border border-transparent rounded-2xl text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#1DD1A1] focus:border-transparent transition-all duration-200"
                  placeholder="Digite sua senha atual"
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('current')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7F8C8D] hover:text-[#2C3E50]"
                >
                  {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-2">Nova Senha</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleChange('newPassword')}
                  className="w-full px-4 py-3 pr-12 bg-[#E8F8F5] border border-transparent rounded-2xl text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#1DD1A1] focus:border-transparent transition-all duration-200"
                  placeholder="Digite sua nova senha"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7F8C8D] hover:text-[#2C3E50]"
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-[#7F8C8D] mt-1">Mínimo de 6 caracteres</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-2">Confirmar Nova Senha</label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  className="w-full px-4 py-3 pr-12 bg-[#E8F8F5] border border-transparent rounded-2xl text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#1DD1A1] focus:border-transparent transition-all duration-200"
                  placeholder="Confirme sua nova senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7F8C8D] hover:text-[#2C3E50]"
                >
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Dicas de Segurança */}
            <div className="p-4 bg-blue-50 rounded-2xl">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Dicas de Segurança
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use uma senha forte com letras, números e símbolos</li>
                <li>• Não compartilhe sua senha com ninguém</li>
                <li>• Altere sua senha regularmente</li>
                <li>• Não use a mesma senha em outros aplicativos</li>
              </ul>
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1" disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit} className="flex-1" loading={loading}>
            Alterar Senha
          </Button>
        </div>
      </div>
    </div>
  )
}