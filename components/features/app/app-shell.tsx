"use client"

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useNativeNavigation, Screen } from '@/hooks/use-native-navigation'
import { SwipeDetector } from '@/lib/native-navigation'
import { ScreenTransition } from './screen-transition'
import { NativeNavigation } from '../navigation/native-navigation'
import { DashboardScreen } from '../dashboard/dashboard-screen'
import { GoalsScreen } from '../goals/goals-screen'
import { ExpenseScreen } from '../expense/expense-screen'
import { CategoriesScreen } from '../categories/categories-screen'
import { ProfileScreen } from '../profile/profile-screen'
import { AuthContainer } from '../auth/auth-container'

export function AppShell() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  
  const {
    currentScreen,
    previousScreen,
    isTransitioning,
    direction,
    navigateToScreen,
    handleSwipeGesture
  } = useNativeNavigation()

  const containerRef = useRef<HTMLDivElement>(null)
  const swipeDetector = useRef(new SwipeDetector({ threshold: 80, velocity: 0.2 }))

  // Proteção de rota - verificar autenticação
  useEffect(() => {
    if (!authLoading && !user) {
      // Se não estiver autenticado, não redirecionar via router
      // Em vez disso, renderizar AuthContainer diretamente
      console.log('Usuário não autenticado, mostrando AuthContainer')
    }
  }, [user, authLoading])

  // Configurar detecção de swipe
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const detector = swipeDetector.current

    const handleTouchStart = (e: TouchEvent) => {
      detector.onTouchStart(e)
    }

    const handleTouchEnd = (e: TouchEvent) => {
      detector.onTouchEnd(e, (direction) => {
        if (direction === 'left') {
          handleSwipeGesture('left')
        } else if (direction === 'right') {
          handleSwipeGesture('right')
        }
      })
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleSwipeGesture])

  // Prevenção de scroll durante transições
  useEffect(() => {
    if (isTransitioning) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isTransitioning])

  // Loading de autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F4F3]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#1DD1A1] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#7F8C8D] font-medium">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Se não estiver autenticado, mostrar AuthContainer
  if (!user) {
    return <AuthContainer initialView="login" />
  }

  const renderScreen = (screen: Screen) => {
    switch (screen) {
      case 'dashboard':
        return <DashboardScreen />
      case 'goals':
        return <GoalsScreen />
      case 'expense':
        return <ExpenseScreen />
      case 'categories':
        return <CategoriesScreen />
      case 'profile':
        return <ProfileScreen />
      default:
        return <DashboardScreen />
    }
  }

  return (
    <div className="relative h-screen overflow-hidden bg-gray-50">
      {/* Container principal com detecção de swipe */}
      <div 
        ref={containerRef}
        className="relative h-full w-full touch-pan-y"
        style={{ touchAction: 'pan-y' }}
      >
        {/* Renderizar todas as telas para transições suaves */}
        {(['dashboard', 'goals', 'expense', 'categories', 'profile'] as Screen[]).map((screen) => (
          <ScreenTransition
            key={screen}
            screen={screen}
            currentScreen={currentScreen}
            isTransitioning={isTransitioning}
            direction={direction}
          >
            <div className="h-full pb-20 overflow-y-auto">
              {renderScreen(screen)}
            </div>
          </ScreenTransition>
        ))}

        {/* Overlay durante transições */}
        {isTransitioning && (
          <div className="absolute inset-0 bg-black/5 z-20 pointer-events-none transition-opacity duration-300" />
        )}
      </div>

      {/* Navegação nativa */}
      <NativeNavigation
        currentScreen={currentScreen}
        onNavigate={navigateToScreen}
        isTransitioning={isTransitioning}
      />

      {/* Indicador de loading global */}
      {isTransitioning && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#1DD1A1] rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Carregando...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}