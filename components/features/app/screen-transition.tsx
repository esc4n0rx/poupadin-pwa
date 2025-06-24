"use client"

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Screen } from '@/hooks/use-native-navigation'

interface ScreenTransitionProps {
  children: ReactNode
  screen: Screen
  currentScreen: Screen
  isTransitioning: boolean
  direction: 'forward' | 'backward' | 'none'
  className?: string
}

export function ScreenTransition({
  children,
  screen,
  currentScreen,
  isTransitioning,
  direction,
  className
}: ScreenTransitionProps) {
  const isActive = screen === currentScreen
  const isVisible = isActive || isTransitioning

  // Definir posição baseada na direção da transição
  const getTransformClass = () => {
    if (!isTransitioning) {
      return isActive ? 'translate-x-0' : 'translate-x-full'
    }

    if (screen === currentScreen) {
      // Tela que está entrando
      return direction === 'forward' ? 'translate-x-0' : 'translate-x-0'
    } else {
      // Tela que está saindo
      return direction === 'forward' ? '-translate-x-full' : 'translate-x-full'
    }
  }

  const getOpacityClass = () => {
    if (!isTransitioning) {
      return isActive ? 'opacity-100' : 'opacity-0'
    }
    return screen === currentScreen ? 'opacity-100' : 'opacity-0'
  }

  return (
    <div
      className={cn(
        'absolute inset-0 transition-all duration-300 ease-out',
        getTransformClass(),
        getOpacityClass(),
        !isVisible && 'pointer-events-none',
        className
      )}
      style={{
        zIndex: isActive ? 10 : 1
      }}
    >
      {children}
    </div>
  )
}