// app/page.tsx
"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AccessControlWrapper } from '@/components/access-control-wrapper'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/pwa-check')
  }, [router])

  return (
    <AccessControlWrapper>
      <div className="min-h-screen bg-[#F0F4F3] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-[#1DD1A1] rounded-full mx-auto animate-pulse" />
          <p className="text-[#7F8C8D]">Carregando aplicação...</p>
        </div>
      </div>
    </AccessControlWrapper>
  )
}