"use client"

import { Home, BarChart3, Receipt, Grid3X3, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Screen } from "@/hooks/use-native-navigation"

interface NavigationItem {
  screen: Screen
  icon: typeof Home
  label: string
}

const navigationItems: NavigationItem[] = [
  { screen: 'dashboard', icon: Home, label: 'Início' },
  { screen: 'goals', icon: BarChart3, label: 'Objetivos' },
  { screen: 'expense', icon: Receipt, label: '' }, // Central button
  { screen: 'categories', icon: Grid3X3, label: 'Categorias' },
  { screen: 'profile', icon: User, label: 'Perfil' },
]

interface NativeNavigationProps {
  currentScreen: Screen
  onNavigate: (screen: Screen) => void
  isTransitioning: boolean
}

export function NativeNavigation({ currentScreen, onNavigate, isTransitioning }: NativeNavigationProps) {
  const handleItemClick = (screen: Screen) => {
    if (!isTransitioning) {
      onNavigate(screen)
      
      // Haptic feedback para dispositivos que suportam
      if ('vibrate' in navigator) {
        navigator.vibrate(50)
      }
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200/50 px-6 py-3 z-50">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {navigationItems.map((item) => {
          const isActive = currentScreen === item.screen
          const isCenter = item.screen === 'expense'

          if (isCenter) {
            return (
              <button
                key={item.screen}
                onClick={() => handleItemClick(item.screen)}
                disabled={isTransitioning}
                className={cn(
                  "relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform",
                  "bg-gradient-to-r from-[#1DD1A1] to-[#00A085]",
                  isActive ? "scale-110 shadow-xl" : "scale-100 hover:scale-105",
                  isTransitioning && "opacity-75"
                )}
              >
                <item.icon className="w-7 h-7 text-white" />
                
                {/* Indicador de ativo para botão central */}
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#1DD1A1] rounded-full" />
                  </div>
                )}
              </button>
            )
          }

          return (
            <button
              key={item.screen}
              onClick={() => handleItemClick(item.screen)}
              disabled={isTransitioning}
              className={cn(
                "flex flex-col items-center space-y-1 py-2 px-3 rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-[#E8F8F5] transform scale-105" 
                  : "hover:bg-gray-100/50",
                isTransitioning && "opacity-75"
              )}
            >
              <div className="relative">
                <item.icon 
                  className={cn(
                    "w-6 h-6 transition-colors duration-300",
                    isActive ? "text-[#1DD1A1]" : "text-[#7F8C8D]"
                  )} 
                />
                
                {/* Indicador de notificação (exemplo) */}
                {item.screen === 'profile' && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
              
              <span 
                className={cn(
                  "text-xs font-medium transition-colors duration-300",
                  isActive ? "text-[#1DD1A1]" : "text-[#7F8C8D]"
                )}
              >
                {item.label}
              </span>
              
              {/* Indicador inferior */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-[#1DD1A1] rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}