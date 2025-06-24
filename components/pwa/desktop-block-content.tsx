// components/pwa/desktop-block-content.tsx
"use client"

import { Monitor, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DesktopBlockContentProps {
  onRetry: () => void
}

export function DesktopBlockContent({ onRetry }: DesktopBlockContentProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-6 p-6">
      <div className="w-20 h-20 bg-[#E8F8F5] rounded-full flex items-center justify-center">
        <Monitor className="w-10 h-10 text-[#1DD1A1]" />
      </div>
      
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-[#2C3E50]">
          Acesso Apenas Mobile
        </h2>
        <p className="text-[#7F8C8D] leading-relaxed max-w-sm">
          Esta aplicação foi desenvolvida especificamente para dispositivos móveis para proporcionar a melhor experiência possível.
        </p>
      </div>

      <div className="bg-[#E8F8F5] rounded-2xl p-4 w-full max-w-sm">
        <div className="flex items-center space-x-3 mb-3">
          <Smartphone className="w-5 h-5 text-[#1DD1A1]" />
          <span className="text-sm font-medium text-[#2C3E50]">
            Como acessar:
          </span>
        </div>
        <ul className="text-sm text-[#7F8C8D] space-y-2">
          <li>• Abra este link no seu celular</li>
          <li>• Escaneie o QR Code (se disponível)</li>
          <li>• Instale como aplicativo</li>
        </ul>
      </div>

      <Button 
        onClick={onRetry}
        variant="outline"
        className="w-full max-w-sm"
      >
        Verificar Novamente
      </Button>
    </div>
  )
}