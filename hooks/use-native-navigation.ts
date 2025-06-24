"use client"

import { useState, useCallback, useEffect } from 'react'

export type Screen = 'dashboard' | 'goals' | 'expense' | 'categories' | 'profile'

interface NavigationState {
  currentScreen: Screen
  previousScreen: Screen | null
  isTransitioning: boolean
  direction: 'forward' | 'backward' | 'none'
}

const SCREEN_ORDER: Screen[] = ['dashboard', 'goals', 'expense', 'categories', 'profile']

export function useNativeNavigation() {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentScreen: 'dashboard',
    previousScreen: null,
    isTransitioning: false,
    direction: 'none'
  })

  const getDirection = useCallback((from: Screen, to: Screen): 'forward' | 'backward' => {
    const fromIndex = SCREEN_ORDER.indexOf(from)
    const toIndex = SCREEN_ORDER.indexOf(to)
    return toIndex > fromIndex ? 'forward' : 'backward'
  }, [])

  const navigateToScreen = useCallback((screen: Screen) => {
    if (navigationState.currentScreen === screen || navigationState.isTransitioning) {
      return
    }

    const direction = getDirection(navigationState.currentScreen, screen)
    
    setNavigationState(prev => ({
      currentScreen: screen,
      previousScreen: prev.currentScreen,
      isTransitioning: true,
      direction
    }))

    // Finalizar transição após animação
    setTimeout(() => {
      setNavigationState(prev => ({
        ...prev,
        isTransitioning: false,
        direction: 'none'
      }))
    }, 350) // Duração da animação
  }, [navigationState.currentScreen, navigationState.isTransitioning, getDirection])

  // Navegação por gestos (swipe)
  const handleSwipeGesture = useCallback((direction: 'left' | 'right') => {
    const currentIndex = SCREEN_ORDER.indexOf(navigationState.currentScreen)
    
    if (direction === 'left' && currentIndex < SCREEN_ORDER.length - 1) {
      navigateToScreen(SCREEN_ORDER[currentIndex + 1])
    } else if (direction === 'right' && currentIndex > 0) {
      navigateToScreen(SCREEN_ORDER[currentIndex - 1])
    }
  }, [navigationState.currentScreen, navigateToScreen])

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey) {
        const key = event.key
        switch (key) {
          case '1':
            navigateToScreen('dashboard')
            break
          case '2':
            navigateToScreen('goals')
            break
          case '3':
            navigateToScreen('expense')
            break
          case '4':
            navigateToScreen('categories')
            break
          case '5':
            navigateToScreen('profile')
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigateToScreen])

  return {
    ...navigationState,
    navigateToScreen,
    handleSwipeGesture
  }
}