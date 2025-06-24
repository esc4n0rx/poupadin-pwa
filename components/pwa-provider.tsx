// components/pwa-provider.tsx
"use client"

import { useEffect, type ReactNode } from 'react'
import { registerServiceWorker } from '@/lib/pwa-utils'

interface PWAProviderProps {
  children: ReactNode
}

export function PWAProvider({ children }: PWAProviderProps) {
  useEffect(() => {
    // Registrar service worker apenas no cliente
    if (typeof window !== 'undefined') {
      registerServiceWorker()
    }
  }, [])

  return <>{children}</>
}