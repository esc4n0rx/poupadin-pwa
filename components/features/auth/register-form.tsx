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
    birthDate: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem")
      return
    }

    setLoading(true)

    try {
      await register(formData)
      router.push("/onboarding")
    } catch (error) {
      console.error("Erro no registro:", error)
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
          <div>
            <Input
              label="Nome Completo"
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
              placeholder="João Silva"
              required
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
              value={formData.birthDate}
              onChange={handleChange("birthDate")}
              placeholder="DD/MM/AAAA"
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
