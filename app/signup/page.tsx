"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const { signUp, user, loading: authLoading } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    console.log('[SignupPage] useEffect - user:', user, 'authLoading:', authLoading)
    if (!authLoading && user) {
      console.log('[SignupPage] User is authenticated, redirecting to /home')
      router.replace("/home")
    }
  }, [user, authLoading, router])

  // Loading durante verificação de autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-foreground" />
      </div>
    )
  }

  // Se estiver autenticado, não renderizar nada
  if (user) {
    return null
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password) {
      toast.error("Preencha todos os campos")
      return
    }

    if (password.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres")
      return
    }

    setIsLoading(true)

    try {
      const { error } = await signUp(email, password, name)

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Este email já está cadastrado")
        } else if (error.message.includes("Password should be at least")) {
          toast.error("A senha deve ter no mínimo 6 caracteres")
        } else {
          toast.error("Erro ao criar conta. Tente novamente.")
        }
        console.error("Erro no cadastro:", error)
      } else {
        toast.success("Conta criada com sucesso!")
        // O redirecionamento é feito pelo AuthContext
      }
    } catch (error) {
      toast.error("Erro inesperado. Tente novamente.")
      console.error("Erro no cadastro:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">PoupaDin</h1>
          <Link href="/login">
            <Button variant="ghost" className="text-sm">
              Entrar
            </Button>
          </Link>
        </div>

        <div className="flex justify-center mb-8">
          <div className="w-48 h-48">
            <img 
              src="/person-with-phone-financial-app-illustration.jpg" 
              alt="Signup illustration" 
              className="w-full h-full object-contain" 
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Cadastre-se no PoupaDin</h2>
            <p className="text-sm text-muted-foreground">
              Você está no controle dos seus dados e pode deletar sua conta a qualquer momento
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">
                Mínimo de 6 caracteres
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar conta"
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-foreground font-semibold hover:underline">
              Entre agora
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}