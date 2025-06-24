// hooks/use-device-detection.ts
"use client"

import { useState, useEffect } from 'react'
import { DeviceInfo, PWAInstallInfo } from '@/types/pwa'
import { detectDevice, detectPWAInstallation } from '@/lib/pwa-utils'

export function useDeviceDetection() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isDesktop: true,
    isAndroid: false,
    isIOS: false,
    isChrome: false,
    isSafari: false,
    isFirefox: false,
  })
  
  const [pwaInfo, setPwaInfo] = useState<PWAInstallInfo>({
    isInstalled: false,
    isInstallable: false,
    showInstallPrompt: false,
  })
  
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkDevice = () => {
      const device = detectDevice()
      const pwa = detectPWAInstallation()
      
      setDeviceInfo(device)
      setPwaInfo(pwa)
      setIsLoading(false)
    }

    // Verificar imediatamente
    checkDevice()

    // Verificar novamente após pequeno delay para garantir que DOM está pronto
    const timeoutId = setTimeout(checkDevice, 100)

    // Escutar mudanças no display mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    const handleChange = () => {
      const newPwaInfo = detectPWAInstallation()
      setPwaInfo(newPwaInfo)
    }
    
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      clearTimeout(timeoutId)
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return {
    deviceInfo,
    pwaInfo,
    isLoading,
  }
}