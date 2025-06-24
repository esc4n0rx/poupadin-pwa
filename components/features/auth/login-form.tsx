"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    // Limpar erro quando usuário começar a digitar
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await login(formData)

      // Aguardar um pouco para garantir que o contexto foi atualizado
      setTimeout(() => {
        // Buscar o usuário atualizado do contexto
        const userData = JSON.parse(localStorage.getItem('poupadin_user_data') || '{}')
        
        // Verificar se o setup inicial foi completado
        if (userData.initial_setup_completed) {
          router.push("/app")
        } else {
          router.push("/onboarding")
        }
      }, 100)

    } catch (error) {
      console.error("Erro no login:", error)
      setError(error instanceof Error ? error.message : "Erro no login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1DD1A1] to-[#00A085]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 text-white">
        <Link href="/">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-semibold">Bem-vindo</h1>
        <div className="w-6" />
      </div>

      {/* Form Container */}
      <div className="bg-[#F0F4F3] rounded-t-3xl min-h-[calc(100vh-80px)] p-6 pt-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div>
            <Input
              label="Nome de usuário ou Email"
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              placeholder="exemplo@exemplo.com"
              required
            />
          </div>

          <div>
            <Input
              label="Senha"
              type="password"
              value={formData.password}
              onChange={handleChange("password")}
              required
            />
          </div>

          <Button type="submit" className="w-full mt-8" loading={loading}>
            Entrar
          </Button>

          <div className="text-center">
            <Link href="/auth/forgot-password" className="text-[#1DD1A1] hover:text-[#00A085] transition-colors">
              Esqueci minha senha?
            </Link>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-[#7F8C8D] text-sm">Criar Conta</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Biometria e Social Login */}
        <div className="text-center space-y-4">
          <p className="text-[#7F8C8D]">
            Use <span className="text-[#1DD1A1] font-medium">Biometria</span> para acessar
          </p>
          <p className="text-[#7F8C8D]">ou entre com</p>

          <div className="flex justify-center space-x-4">
            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Facebook className="w-6 h-6 text-blue-600" />
            </button>
            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              <span className="text-xl font-bold text-red-500">G</span>
            </button>
          </div>

          <div className="mt-8">
            <span className="text-[#7F8C8D]">Não tem uma conta? </span>
            <Link href="/auth/register" className="text-[#1DD1A1] hover:text-[#00A085] font-medium transition-colors">
              Criar Conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}