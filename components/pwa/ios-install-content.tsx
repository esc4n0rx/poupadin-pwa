// components/pwa/ios-install-content.tsx
"use client"

import { useState } from 'react'
import { Share, Home, ArrowRight, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface IOSInstallContentProps {
  onSkip: () => void
}

export function IOSInstallContent({ onSkip }: IOSInstallContentProps) {
  const [currentStep, setCurrentStep] = useState(1)

  const steps = [
    {
      id: 1,
      title: "Toque no botão Compartilhar",
      description: "Na barra inferior do Safari, toque no ícone de compartilhar",
      icon: <Share className="w-6 h-6" />,
    },
    {
      id: 2,
      title: "Adicionar à Tela de Início",
      description: "Role para baixo e selecione 'Adicionar à Tela de Início'",
      icon: <Square className="w-6 h-6" />,
    },
    {
      id: 3,
      title: "Confirmar instalação",
      description: "Toque em 'Adicionar' no canto superior direito",
      icon: <Home className="w-6 h-6" />,
    },
  ]

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-[#E8F8F5] rounded-full flex items-center justify-center mx-auto">
          <Share className="w-8 h-8 text-[#1DD1A1]" />
        </div>
        <h2 className="text-xl font-bold text-[#2C3E50]">
          Instale o App no Safari
        </h2>
        <p className="text-sm text-[#7F8C8D]">
          Siga os passos abaixo para adicionar o app à sua tela inicial
        </p>
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

      {/* Dica importante para iOS */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900">
              Importante
            </h4>
            <p className="text-xs text-blue-700 mt-1">
              Este tutorial funciona apenas no Safari. Se você está usando outro navegador, abra este link no Safari primeiro.
            </p>
          </div>
        </div>
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