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

  const handleSave = () => {
    // TODO: Implementar salvamento das configurações
    console.log('Salvando configurações:', settings)
    onClose()
  }

  return (
    <div className="modal-container">
      <div className="modal-content-with-nav">
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
                <span className="text-sm text-[#2C3E50]">Notificações push</span>
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={() => handleToggle('pushNotifications')}
                  className="w-4 h-4 text-[#1DD1A1] bg-gray-100 border-gray-300 rounded focus:ring-[#1DD1A1] focus:ring-2"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#2C3E50]">Notificações por email</span>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                  className="w-4 h-4 text-[#1DD1A1] bg-gray-100 border-gray-300 rounded focus:ring-[#1DD1A1] focus:ring-2"
                />
              </div>
            </div>
          </div>

          {/* Localização */}
          <div>
            <h3 className="text-sm font-medium text-[#2C3E50] mb-3 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Localização
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
                  <option value="BRL">Real (BRL)</option>
                  <option value="USD">Dólar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
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
            <div className="p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-[#2C3E50] text-sm">Este dispositivo</p>
                  <p className="text-xs text-[#7F8C8D]">Ativo agora</p>
                </div>
              </div>
              <p className="text-xs text-[#7F8C8D]">
                Gerencie seus dispositivos conectados na seção de segurança.
              </p>
            </div>
          </div>

          {/* Informações do App */}
          <div>
            <h3 className="text-sm font-medium text-[#2C3E50] mb-3">Informações do App</h3>
            <div className="space-y-2 text-sm text-[#7F8C8D]">
              <div className="flex justify-between">
                <span>Versão</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Build</span>
                <span>2025.06.001</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions-sticky">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Salvar
          </Button>
        </div>
      </div>
    </div>
  )
}