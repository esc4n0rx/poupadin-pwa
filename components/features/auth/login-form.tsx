// components/features/auth/login-form.tsx
"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

interface LoginFormProps {
  onNavigateToRegister?: () => void
  onNavigateToForgotPassword?: () => void
}

export function LoginForm({ onNavigateToRegister, onNavigateToForgotPassword }: LoginFormProps) {
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

      setTimeout(() => {
        const userData = JSON.parse(localStorage.getItem('poupadin_user_data') || '{}')
        
        if (userData.initial_setup_completed) {
          router.push("/app")
        } else {
          router.push("/onboarding")
        }
      }, 100)

    } catch (error) {
      console.error("Erro no login:", error)
      setError(error instanceof Error ? error.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    if (onNavigateToForgotPassword) {
      onNavigateToForgotPassword()
    } else {
      // Fallback para navegação por rota se não houver prop
      router.push('/auth/forgot-password')
    }
  }

  const handleNavigateToRegister = () => {
    if (onNavigateToRegister) {
      onNavigateToRegister()
    } else {
      // Fallback para navegação por rota se não houver prop
      router.push('/auth/register')
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F4F3] flex flex-col">
      {/* Header */}
      <div className="bg-[#1DD1A1] pt-16 pb-20 px-6">
        <div className="text-center mt-8">
          <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de Volta!</h1>
          <p className="text-white/90">Entre na sua conta para continuar</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-6 pt-8 px-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleChange("email")}
              placeholder="Digite seu email"
              disabled={loading}
            />
          </div>

          <div>
            <Input
              type="password"
              label="Senha"
              value={formData.password}
              onChange={handleChange("password")}
              placeholder="Digite sua senha"
              error={error}
              disabled={loading}
            />
          </div>

          {/* Link Esqueci Minha Senha */}
          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[#1DD1A1] hover:text-[#00A085] font-medium transition-colors text-sm"
            >
              Esqueci minha senha
            </button>
          </div>

          <Button type="submit" className="w-full mt-8" loading={loading}>
            Entrar
          </Button>

          {/* Divisor */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#7F8C8D]">ou criar conta com</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="flex space-x-4">
            <Button variant="outline" className="flex-1 flex items-center justify-center space-x-2" disabled>
              <Facebook className="w-5 h-5 text-blue-600" />
              <span>Facebook</span>
            </Button>
            <Button variant="outline" className="flex-1 flex items-center justify-center space-x-2" disabled>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Google</span>
            </Button>
          </div>

          <div className="text-center mt-8">
            <span className="text-[#7F8C8D]">Não tem uma conta? </span>
            <button
              type="button"
              onClick={handleNavigateToRegister}
              className="text-[#1DD1A1] hover:text-[#00A085] font-medium transition-colors"
            >
              Criar Conta
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}