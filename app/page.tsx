"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Loader2, PiggyBank, TrendingUp, Shield, Smartphone } from "lucide-react"

const onboardingSlides = [
  {
    icon: PiggyBank,
    title: "Controle Total",
    description: "Registre receitas e despesas facilmente e tenha visão completa do seu dinheiro",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: TrendingUp,
    title: "Estatísticas",
    description: "Visualize gráficos e relatórios para entender seus hábitos financeiros",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Shield,
    title: "Segurança",
    description: "Seus dados estão protegidos com criptografia de ponta a ponta",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Smartphone,
    title: "PWA",
    description: "Funciona como app no seu celular, mesmo offline",
    color: "from-orange-500 to-red-500"
  }
]

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [currentSlide, setCurrentSlide] = useState(0)

  // Se já estiver autenticado, redirecionar para home
  useEffect(() => {
    if (!loading && user) {
      router.push("/home")
    }
  }, [user, loading, router])

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % onboardingSlides.length)
    }, 3000) // Muda a cada 3 segundos

    return () => clearInterval(timer)
  }, [])

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

  const CurrentIcon = onboardingSlides[currentSlide].icon

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Logo */}
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold text-foreground">PoupaDin</h1>
      </div>

      {/* Slides Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* Icon with gradient background */}
        <div className="relative mb-8">
          <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${onboardingSlides[currentSlide].color} flex items-center justify-center shadow-2xl transition-all duration-500 ease-in-out`}>
            <CurrentIcon className="w-16 h-16 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4 max-w-md mx-auto transition-all duration-500 ease-in-out">
          <h2 className="text-3xl font-bold text-foreground">
            {onboardingSlides[currentSlide].title}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {onboardingSlides[currentSlide].description}
          </p>
        </div>

        {/* Dots Indicator */}
        <div className="flex gap-2 mt-12">
          {onboardingSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? "w-8 h-2 bg-foreground"
                  : "w-2 h-2 bg-muted-foreground/30"
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-6 pb-8">
        <Button
          size="lg"
          className="w-full text-lg h-14 rounded-full shadow-lg"
          onClick={() => router.push("/login")}
        >
          Vamos começar
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Já tem uma conta?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-foreground font-semibold underline"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  )
}