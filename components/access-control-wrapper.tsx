// components/access-control-wrapper.tsx
"use client"

import { useState, useEffect, type ReactNode } from 'react'
import { DeviceAccessModal } from '@/components/pwa/device-access-modal'
import { useDeviceDetection } from '@/hooks/use-device-detection'

interface AccessControlWrapperProps {
  children: ReactNode
}

export function AccessControlWrapper({ children }: AccessControlWrapperProps) {
  const [showModal, setShowModal] = useState(true)
  const [accessGranted, setAccessGranted] = useState(false)
  const { deviceInfo, pwaInfo, isLoading } = useDeviceDetection()

  useEffect(() => {
    // Se está carregando, não fazer nada ainda
    if (isLoading) return

    // Se já é PWA instalado, liberar acesso imediatamente
    if (pwaInfo.isInstalled) {
      setAccessGranted(true)
      setShowModal(false)
      return
    }

    // Se é desktop, manter bloqueado
    if (deviceInfo.isDesktop) {
      setShowModal(true)
      return
    }

    // Para mobile, mostrar modal de instalação
    setShowModal(true)
  }, [deviceInfo, pwaInfo, isLoading])

  const handleAccessGranted = () => {
    setAccessGranted(true)
    setShowModal(false)
  }

  // Enquanto está carregando ou não tem acesso, mostrar modal
  if (showModal || !accessGranted) {
    return <DeviceAccessModal onAccessGranted={handleAccessGranted} />
  }

  // Acesso liberado, renderizar conteúdo normal
  return <>{children}</>
}