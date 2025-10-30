"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Loader2, PiggyBank, TrendingUp, Shield, Smartphone } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  // Se já estiver autenticado, redirecionar para home
  useEffect(() => {
    if (!loading && user) {
      router.push("/home")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-foreground" />
      </div>
    )
  }

  // Se estiver autenticado, não mostrar nada (redirecionamento em andamento)
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">PoupaDin</h1>
        <div className="space-x-2">
          <Link href="/login">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link href="/signup">
            <Button>Cadastrar</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Controle suas finanças de forma inteligente
            </h2>
            <p className="text-lg text-muted-foreground">
              Gerencie seu dinheiro, acompanhe gastos e alcance suas metas financeiras com o PoupaDin
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Começar gratuitamente
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Já tenho conta
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <PiggyBank className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Controle Total</h3>
              <p className="text-muted-foreground">
                Registre receitas e despesas facilmente e tenha visão completa do seu dinheiro
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Estatísticas</h3>
              <p className="text-muted-foreground">
                Visualize gráficos e relatórios para entender seus hábitos financeiros
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Segurança</h3>
              <p className="text-muted-foreground">
                Seus dados estão protegidos com criptografia de ponta a ponta
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">PWA</h3>
              <p className="text-muted-foreground">
                Funciona como app no seu celular, mesmo offline
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}