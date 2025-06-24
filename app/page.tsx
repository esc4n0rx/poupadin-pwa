"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { AuthContainer } from '@/components/features/auth/auth-container'

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Se está carregando, não fazer nada ainda
    if (isLoading) return

    // Se está autenticado, redirecionar para o app
    if (user) {
      router.replace('/app')
    }
  }, [user, isLoading, router])

  // Loading de autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F4F3]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#1DD1A1] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#7F8C8D] font-medium">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não estiver autenticado, mostrar tela de login/registro
  if (!user) {
    return <AuthContainer initialView="login" />
  }

  // Se estiver autenticado, mostrar loading enquanto redireciona
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F4F3]">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#1DD1A1] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#7F8C8D] font-medium">Redirecionando...</p>
      </div>
    </div>
  )
}