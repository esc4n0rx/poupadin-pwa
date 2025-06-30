"use client"

import React, { useState } from 'react'
import { X, Bell, Smartphone, Moon, Sun, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SettingsModalProps {
  onClose: () => void
}

interface AppSettings {
  notifications: boolean
  darkMode: boolean
  language: string
  currency: string
  biometrics: boolean
  autoBackup: boolean
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState<AppSettings>({
    notifications: true,
    darkMode: false,
    language: 'pt-BR',
    currency: 'BRL',
    biometrics: false,
    autoBackup: true,
  })

  const handleToggle = (key: keyof AppSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSelect = (key: keyof AppSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // Implementar lógica de salvamento
    console.log('Configurações salvas:', settings)
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-popup">
        <div className="modal-header">
          <h2 className="text-xl font-bold text-[#2C3E50]">Configurações</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-[#7F8C8D]" />
          </button>
        </div>

        <div className="modal-body">
          <div className="space-y-6">
            {/* Notificações */}
            <div>
              <h3 className="text-sm font-medium text-[#2C3E50] mb-3 flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                Notificações
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#2C3E50]">Notificações Push</span>
                  <button
                    onClick={() => handleToggle('notifications')}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.notifications ? 'bg-[#1DD1A1]' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.notifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#2C3E50]">Backup Automático</span>
                  <button
                    onClick={() => handleToggle('autoBackup')}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.autoBackup ? 'bg-[#1DD1A1]' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.autoBackup ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Aparência */}
            <div>
              <h3 className="text-sm font-medium text-[#2C3E50] mb-3 flex items-center">
                {settings.darkMode ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
                Aparência
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#2C3E50]">Modo Escuro</span>
                <button
                  onClick={() => handleToggle('darkMode')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.darkMode ? 'bg-[#1DD1A1]' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.darkMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>

            {/* Segurança */}
            <div>
              <h3 className="text-sm font-medium text-[#2C3E50] mb-3">Segurança</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#2C3E50]">Autenticação Biométrica</span>
                <button
                  onClick={() => handleToggle('biometrics')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.biometrics ? 'bg-[#1DD1A1]' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.biometrics ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>

            {/* Regionalização */}
            <div>
              <h3 className="text-sm font-medium text-[#2C3E50] mb-3 flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Regionalização
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
        </div>

        <div className="modal-footer">
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