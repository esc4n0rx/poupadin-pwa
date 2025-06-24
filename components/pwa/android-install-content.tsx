// components/pwa/android-install-content.tsx
"use client"

import { useState } from 'react'
import { Chrome, Download, Home, ArrowRight, MoreVertical, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePWAInstall } from '@/hooks/use-pwa-install'

interface AndroidInstallContentProps {
  onSkip: () => void
}

export function AndroidInstallContent({ onSkip }: AndroidInstallContentProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const { isInstallable, promptInstall } = usePWAInstall()

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await promptInstall()
      if (success) {
        onSkip() // Continuar após instalação
      }
    }
  }

  const steps = [
    {
      id: 1,
      title: "Toque no menu do Chrome",
      description: "Procure pelos três pontos no canto superior direito",
      icon: <MoreVertical className="w-6 h-6" />,
    },
    {
      id: 2,
      title: "Adicionar à tela inicial",
      description: "Selecione a opção 'Adicionar à tela inicial'",
      icon: <Plus className="w-6 h-6" />,
    },
    {
      id: 3,
      title: "Confirmar instalação",
      description: "Toque em 'Adicionar' para instalar o app",
      icon: <Download className="w-6 h-6" />,
    },
  ]

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-[#E8F8F5] rounded-full flex items-center justify-center mx-auto">
          <Chrome className="w-8 h-8 text-[#1DD1A1]" />
        </div>
        <h2 className="text-xl font-bold text-[#2C3E50]">
          Instale o App
        </h2>
        <p className="text-sm text-[#7F8C8D]">
          Para uma melhor experiência, instale o aplicativo na sua tela inicial
        </p>
      </div>

      {/* Botão de instalação automática se disponível */}
      {isInstallable && (
        <Button 
          onClick={handleInstallClick}
          className="w-full btn-primary"
        >
          <Download className="w-4 h-4 mr-2" />
          Instalar Automaticamente
        </Button>
      )}

      <div className="text-center text-xs text-[#7F8C8D]">
        ou siga o tutorial abaixo
      </div>

      {/* Tutorial passo a passo */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`flex items-start space-x-4 p-4 rounded-xl transition-colors ${
              currentStep === step.id 
                ? 'bg-[#E8F8F5] border border-[#1DD1A1]' 
                : 'bg-gray-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              currentStep === step.id 
                ? 'bg-[#1DD1A1] text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {currentStep > step.id ? (
                <div className="w-2 h-2 bg-white rounded-full" />
              ) : (
                step.icon
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-[#2C3E50]">
                {step.title}
              </h3>
              <p className="text-xs text-[#7F8C8D] mt-1">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navegação */}
      <div className="flex space-x-3">
        {currentStep < steps.length ? (
          <>
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="flex-1"
            >
              Próximo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </>
        ) : (
          <Button 
            onClick={onSkip}
            className="flex-1 btn-primary"
          >
            Continuar
          </Button>
        )}
        
        <Button 
          variant="outline"
          onClick={onSkip}
          className="px-6"
        >
          Pular
        </Button>
      </div>
    </div>
  )
}