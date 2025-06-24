"use client"

import { useState, useEffect } from 'react'
import { X, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePWAInstall } from '@/hooks/use-pwa-install'
import { usePWAState } from '@/hooks/use-pwa-state'

export function PWAInstallBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const { isInstallable, promptInstall } = usePWAInstall()
  const { shouldShowInstallPrompt, setInstallPromptDismissed, setHasSeenInstallPrompt } = usePWAState()

  useEffect(() => {
    if (isInstallable && shouldShowInstallPrompt()) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 3000) // Mostrar após 3 segundos

      return () => clearTimeout(timer)
    }
  }, [isInstallable, shouldShowInstallPrompt])

  const handleInstall = async () => {
    const success = await promptInstall()
    if (success) {
      setIsVisible(false)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setInstallPromptDismissed()
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-40 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-3">
          <h3 className="text-sm font-medium text-[#2C3E50]">
            Instalar App
          </h3>
          <p className="text-xs text-[#7F8C8D] mt-1">
            Adicione à tela inicial para acesso rápido
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            onClick={handleInstall}
            className="btn-primary text-xs px-3 py-1"
          >
            <Download className="w-3 h-3 mr-1" />
            Instalar
          </Button>
          
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-4 h-4 text-[#7F8C8D]" />
          </button>
        </div>
      </div>
    </div>
  )
}