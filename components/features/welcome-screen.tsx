"use client"

import { TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function WelcomeScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1DD1A1] to-[#00A085] flex flex-col items-center justify-center px-6">
      {/* Logo e Ícone */}
      <div className="flex flex-col items-center mb-12">
        <div className="bg-white/20 p-6 rounded-3xl mb-6">
          <TrendingUp className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Poupadin</h1>
        <p className="text-white/90 text-center text-lg max-w-sm">
          Gerencie suas finanças de forma simples e inteligente.
        </p>
      </div>

      {/* Botões de Ação */}
      <div className="w-full max-w-sm space-y-4">
        <Link href="/auth/login" className="block">
          <Button className="w-full bg-white text-[#1DD1A1] hover:bg-gray-50 font-semibold py-4 text-lg rounded-2xl">
            Entrar
          </Button>
        </Link>

        <Link href="/auth/register" className="block">
          <Button
            variant="outline"
            className="w-full bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold py-4 text-lg rounded-2xl"
          >
            Criar Conta
          </Button>
        </Link>
      </div>

      {/* Link para recuperação */}
      <Link href="/auth/forgot-password" className="mt-8 text-white/80 hover:text-white transition-colors">
        Esqueci minha senha?
      </Link>
    </div>
  )
}
