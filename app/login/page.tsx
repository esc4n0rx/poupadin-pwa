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

export default function LoginPage() {
  const router = useRouter()
  const { signIn, user, loading: authLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    console.log('[LoginPage] useEffect - user:', user, 'authLoading:', authLoading)
    if (!authLoading && user) {
      console.log('[LoginPage] User is authenticated, redirecting to /home')
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error("Preencha todos os campos")
      return
    }

    setIsLoading(true)

    try {
      const { error } = await signIn(email, password)

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email ou senha incorretos")
        } else {
          toast.error("Erro ao fazer login. Tente novamente.")
        }
        console.error("Erro no login:", error)
      } else {
        toast.success("Login realizado com sucesso!")
        // O redirecionamento é feito pelo AuthContext
      }
    } catch (error) {
      toast.error("Erro inesperado. Tente novamente.")
      console.error("Erro no login:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">PoupaDin</h1>
          <Link href="/signup">
            <Button variant="ghost" className="text-sm">
              Cadastrar
            </Button>
          </Link>
        </div>

        <div className="flex justify-center mb-8">
          <div className="w-48 h-48">
            <img 
              src="/person-with-phone-financial-app-illustration.jpg" 
              alt="Login illustration" 
              className="w-full h-full object-contain" 
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Entre na sua conta</h2>

          <form onSubmit={handleLogin} className="space-y-4">
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
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link href="/signup" className="text-foreground font-semibold hover:underline">
              Cadastre-se
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}