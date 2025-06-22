"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export function RegisterForm() {
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
      return "Email deve ser válido"
    }

    if (!formData.date_of_birth) {
      return "Data de nascimento é obrigatória"
    }

    // Validar se a data está no formato correto (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(formData.date_of_birth)) {
      return "Data de nascimento deve estar no formato correto"
    }

    // Validar se a pessoa tem pelo menos 13 anos
    const birthDate = new Date(formData.date_of_birth)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (age < 13 || (age === 13 && monthDiff < 0) || (age === 13 && monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return "Você deve ter pelo menos 13 anos"
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
    setError("")

    // Validar formulário
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      // Preparar dados exatamente como a API espera
      const registerData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        date_of_birth: formData.date_of_birth, // Já está no formato YYYY-MM-DD do input type="date"
      }

      console.log('Dados enviados para registro:', registerData) // Para debug

      await register(registerData)
      
      // Aguardar um pouco para garantir que o contexto foi atualizado
      setTimeout(() => {
        // Após registro e login automático, sempre vai para onboarding
        // pois initial_setup_completed será false para novos usuários
        router.push("/onboarding")
      }, 100)

    } catch (error) {
      console.error("Erro no registro:", error)
      setError(error instanceof Error ? error.message : "Erro no registro")
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
        <h1 className="text-xl font-semibold">Criar Conta</h1>
        <div className="w-6" />
      </div>

      {/* Form Container */}
      <div className="bg-[#F0F4F3] rounded-t-3xl min-h-[calc(100vh-80px)] p-6 pt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div>
            <Input
              label="Nome Completo"
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
              placeholder="João Silva"
              required
              minLength={3}
            />
          </div>

          <div>
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              placeholder="exemplo@exemplo.com"
              required
            />
          </div>

          <div>
            <Input
              label="Data de Nascimento"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange("date_of_birth")}
              required
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split('T')[0]}
            />
          </div>

          <div>
            <Input
              label="Senha"
              type="password"
              value={formData.password}
              onChange={handleChange("password")}
              required
              minLength={8}
            />
          </div>

          <div>
            <Input
              label="Confirmar Senha"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              required
            />
          </div>

          <div className="text-center text-sm text-[#7F8C8D] mt-6">
            Ao continuar, você concorda com os{" "}
            <Link href="/terms" className="text-[#1DD1A1] hover:text-[#00A085]">
              Termos de Uso
            </Link>{" "}
            e{" "}
            <Link href="/privacy" className="text-[#1DD1A1] hover:text-[#00A085]">
              Política de Privacidade
            </Link>
            .
          </div>

          <Button type="submit" className="w-full mt-8" loading={loading}>
            Criar Conta
          </Button>

          <div className="text-center mt-6">
            <span className="text-[#7F8C8D]">Já tem uma conta? </span>
            <Link href="/auth/login" className="text-[#1DD1A1] hover:text-[#00A085] font-medium transition-colors">
              Entrar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}