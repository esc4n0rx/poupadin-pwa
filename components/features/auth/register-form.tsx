// components/features/auth/register-form.tsx
"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

interface RegisterFormProps {
  onNavigateToLogin?: () => void
}

export function RegisterForm({ onNavigateToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date_of_birth: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { register } = useAuth()
  const router = useRouter()

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    // Limpar erro quando usuário começar a digitar
    if (error) setError("")
  }

  const validateForm = (): string | null => {
    if (formData.name.trim().length < 3) {
      return "O nome deve ter pelo menos 3 caracteres"
    }

    if (!formData.email.trim()) {
      return "Email é obrigatório"
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return "Email inválido"
    }

    if (!formData.date_of_birth) {
      return "Data de nascimento é obrigatória"
    }

    // Validar idade mínima (13 anos)
    const birthDate = new Date(formData.date_of_birth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    if (age < 13) {
      return "Você deve ter pelo menos 13 anos para se cadastrar"
    }

    if (formData.password.length < 8) {
      return "A senha deve ter pelo menos 8 caracteres"
    }

    if (formData.password !== formData.confirmPassword) {
      return "As senhas não coincidem"
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError("")

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        date_of_birth: formData.date_of_birth,
      })

      // Após registro bem-sucedido, redirecionar para onboarding
      router.push("/onboarding")
    } catch (error) {
      console.error("Erro no registro:", error)
      setError(error instanceof Error ? error.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  const handleNavigateToLogin = () => {
    if (onNavigateToLogin) {
      onNavigateToLogin()
    } else {
      // Fallback para navegação por rota se não houver prop
      router.push('/auth/login')
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F4F3] flex flex-col">
      {/* Header */}
      <div className="bg-[#1DD1A1] pt-16 pb-20 px-6 relative">
        <button
          onClick={handleNavigateToLogin}
          className="absolute top-16 left-6 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="text-center mt-8">
          <h1 className="text-3xl font-bold text-white mb-2">Criar Conta</h1>
          <p className="text-white/90">Preencha seus dados para começar</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-6 pt-8 px-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="text"
              label="Nome Completo"
              value={formData.name}
              onChange={handleChange("name")}
              placeholder="Digite seu nome"
              disabled={loading}
            />
          </div>

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
              type="date"
              label="Data de Nascimento"
              value={formData.date_of_birth}
              onChange={handleChange("date_of_birth")}
              disabled={loading}
            />
          </div>

          <div>
            <Input
              type="password"
              label="Senha"
              value={formData.password}
              onChange={handleChange("password")}
              placeholder="Mínimo 8 caracteres"
              disabled={loading}
            />
          </div>

          <div>
            <Input
              type="password"
              label="Confirmar Senha"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              placeholder="Digite a senha novamente"
              error={error}
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full mt-8" loading={loading}>
            Criar Conta
          </Button>

          <div className="text-center mt-6">
            <span className="text-[#7F8C8D]">Já tem uma conta? </span>
            <button
              type="button"
              onClick={handleNavigateToLogin}
              className="text-[#1DD1A1] hover:text-[#00A085] font-medium transition-colors"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}