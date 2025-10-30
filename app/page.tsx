"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const onboardingSlides = [
  {
    title: "Gerencie seu dinheiro",
    description: "Controle gastos desnecessários e crie hábitos financeiros saudáveis.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4URAnQCBzTSO6CEfjMzCkR8vWx2kga.png",
  },
  {
    title: "Notificações em tempo real",
    description: "Receba alertas quando atingir seus limites de gastos.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4URAnQCBzTSO6CEfjMzCkR8vWx2kga.png",
  },
  {
    title: "Acompanhe seus gastos",
    description: "Analise seus gastos automaticamente através de suas conexões bancárias.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4URAnQCBzTSO6CEfjMzCkR8vWx2kga.png",
  },
]

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()

  const nextSlide = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const handleStart = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-[#FBE6B5] flex flex-col items-center justify-between p-6 pb-12">
      <div className="w-full max-w-md flex-1 flex flex-col items-center justify-center">
        <div className="w-full aspect-square max-w-sm mb-12 flex items-center justify-center">
          <div className="relative w-64 h-64">
            <img
              src={`/.jpg?height=256&width=256&query=${onboardingSlides[currentSlide].title}`}
              alt={onboardingSlides[currentSlide].title}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-bold text-foreground text-balance">{onboardingSlides[currentSlide].title}</h1>
          <p className="text-base text-muted-foreground leading-relaxed text-pretty max-w-sm mx-auto">
            {onboardingSlides[currentSlide].description}
          </p>
        </div>

        <div className="flex gap-2 mb-12">
          {onboardingSlides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? "w-8 bg-foreground" : "w-2 bg-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-md space-y-4">
        <Button
          onClick={handleStart}
          className="w-full h-14 text-base font-medium rounded-2xl bg-foreground text-background hover:bg-foreground/90"
        >
          Começar
        </Button>

        {currentSlide < onboardingSlides.length - 1 && (
          <div className="flex gap-2">
            <Button
              onClick={prevSlide}
              variant="ghost"
              className="flex-1 h-12 rounded-2xl"
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button onClick={nextSlide} variant="ghost" className="flex-1 h-12 rounded-2xl">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
