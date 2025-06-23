// components/features/profile/settings-modal.tsx (continuação)
"use client"

import React, { useState } from 'react'
import { X, Moon, Bell, Globe, Smartphone, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SettingsModalProps {
  onClose: () => void
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState({
    theme: 'light' as 'light' | 'dark' | 'system',
    notifications: true,
    language: 'pt-BR',
    currency: 'BRL',
    pushNotifications: true,
    emailNotifications: false
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: typeof prev[key] === 'boolean' ? !prev[key] : prev[key]
    }))
  }

  const handleSelect = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl w-full max-w-md p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#2C3E50]">Configurações</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-[#7F8C8D]" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Aparência */}
          <div>
            <h3 className="text-sm font-medium text-[#2C3E50] mb-3 flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              Aparência
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#2C3E50]">Tema</span>
                <select
                  value={settings.theme}
                  onChange={(e) => handleSelect('theme', e.target.value)}
                  className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#1DD1A1]"
                >
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                  <option value="system">Sistema</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notificações */}
          <div>
            <h3 className="text-sm font-medium text-[#2C3E50] mb-3 flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Notificações
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-[#2C3E50]">Notificações Push</span>
                  <p className="text-xs text-[#7F8C8D]">Receba alertas no dispositivo</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={() => handleToggle('pushNotifications')}
                  className="w-4 h-4 text-[#1DD1A1] bg-gray-100 border-gray-300 rounded focus:ring-[#1DD1A1] focus:ring-2"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-[#2C3E50]">Notificações por Email</span>
                  <p className="text-xs text-[#7F8C8D]">Receba resumos por email</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                  className="w-4 h-4 text-[#1DD1A1] bg-gray-100 border-gray-300 rounded focus:ring-[#1DD1A1] focus:ring-2"
                />
              </div>
            </div>
          </div>

          {/* Idioma e Região */}
          <div>
            <h3 className="text-sm font-medium text-[#2C3E50] mb-3 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Idioma e Região
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#2C3E50]">Idioma</span>
                <select
                  value={settings.language}
                  onChange={(e) => handleSelect('language', e.target.value)}
                  className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#1DD1A1]"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#2C3E50]">Moeda</span>
                <select
                  value={settings.currency}
                  onChange={(e) => handleSelect('currency', e.target.value)}
                  className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#1DD1A1]"
                >
                  <option value="BRL">Real (R$)</option>
                  <option value="USD">Dólar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dispositivos */}
          <div>
            <h3 className="text-sm font-medium text-[#2C3E50] mb-3 flex items-center">
              <Smartphone className="w-4 h-4 mr-2" />
              Dispositivos
            </h3>
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#1DD1A1] rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#2C3E50]">Navegador Web</p>
                  <p className="text-xs text-[#7F8C8D]">Ativo agora</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="button" className="flex-1" onClick={onClose}>
              Salvar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}