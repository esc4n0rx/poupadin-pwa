// components/pwa/device-access-modal.tsx
"use client"

import { useEffect, useState } from 'react'
import { useDeviceDetection } from '@/hooks/use-device-detection'
import { AccessModalStep } from '@/types/pwa'
import { DesktopBlockContent } from './desktop-block-content'
import { AndroidInstallContent } from './android-install-content'
import { IOSInstallContent } from './ios-install-content'
import { Loader2 } from 'lucide-react'

interface DeviceAccessModalProps {
  onAccessGranted: () => void
}

export function DeviceAccessModal({ onAccessGranted }: DeviceAccessModalProps) {
  const { deviceInfo, pwaInfo, isLoading } = useDeviceDetection()
  const [currentStep, setCurrentStep] = useState<AccessModalStep>('checking')
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (isLoading) {
      setCurrentStep('checking')
      return
    }

    // Se já está instalado como PWA, permitir acesso
    if (pwaInfo.isInstalled) {
      setCurrentStep('allowed')
      setTimeout(() => {
        setIsVisible(false)
        onAccessGranted()
      }, 500)
      return
    }

    // Se é desktop, bloquear
    if (deviceInfo.isDesktop) {
      setCurrentStep('desktop-blocked')
      return
    }

    // Se é mobile mas não instalado
    if (deviceInfo.isMobile) {
      if (deviceInfo.isAndroid) {
        setCurrentStep('android-install')
      } else if (deviceInfo.isIOS) {
        setCurrentStep('ios-install')
      } else {
        // Outros dispositivos mobile, permitir acesso
        setCurrentStep('allowed')
        setTimeout(() => {
          setIsVisible(false)
          onAccessGranted()
        }, 500)
      }
    }
  }, [deviceInfo, pwaInfo, isLoading, onAccessGranted])

  const handleRetry = () => {
    window.location.reload()
  }

  const handleSkipInstall = () => {
    setCurrentStep('allowed')
    setTimeout(() => {
      setIsVisible(false)
      onAccessGranted()
    }, 300)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        {currentStep === 'checking' && (
          <div className="flex flex-col items-center justify-center space-y-4 p-8">
            <Loader2 className="w-8 h-8 text-[#1DD1A1] animate-spin" />
            <p className="text-[#7F8C8D] text-center">
              Verificando dispositivo...
            </p>
          </div>
        )}

        {currentStep === 'desktop-blocked' && (
          <DesktopBlockContent onRetry={handleRetry} />
        )}

        {currentStep === 'android-install' && (
          <AndroidInstallContent onSkip={handleSkipInstall} />
        )}

        {currentStep === 'ios-install' && (
          <IOSInstallContent onSkip={handleSkipInstall} />
        )}

        {currentStep === 'allowed' && (
          <div className="flex flex-col items-center justify-center space-y-4 p-8">
            <div className="w-12 h-12 bg-[#1DD1A1] rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full" />
            </div>
            <p className="text-[#7F8C8D] text-center">
              Acesso liberado!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}