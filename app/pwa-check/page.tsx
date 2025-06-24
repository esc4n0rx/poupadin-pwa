// app/pwa-check/page.tsx
"use client"

import { useState } from 'react'
import { DeviceAccessModal } from '@/components/pwa/device-access-modal'
import { useRouter } from 'next/navigation'

export default function PWACheckPage() {
  const [accessGranted, setAccessGranted] = useState(false)
  const router = useRouter()

  const handleAccessGranted = () => {
    setAccessGranted(true)
    // Redirecionar para a rota principal após acesso liberado
    router.replace('/auth/login') // Altere para a rota desejada
  }

  if (accessGranted) {
    return null // O redirecionamento já foi feito
  }

  return <DeviceAccessModal onAccessGranted={handleAccessGranted} />
}