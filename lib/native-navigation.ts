export type SwipeDirection = 'left' | 'right' | 'up' | 'down'

interface SwipeConfig {
  threshold: number
  velocity: number
}

const defaultConfig: SwipeConfig = {
  threshold: 50,
  velocity: 0.3
}

export class SwipeDetector {
  private startX: number = 0
  private startY: number = 0
  private startTime: number = 0
  private config: SwipeConfig

  constructor(config: Partial<SwipeConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  onTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0]
    this.startX = touch.clientX
    this.startY = touch.clientY
    this.startTime = Date.now()
  }

  onTouchEnd = (event: TouchEvent, onSwipe: (direction: SwipeDirection) => void) => {
    const touch = event.changedTouches[0]
    const endX = touch.clientX
    const endY = touch.clientY
    const endTime = Date.now()

    const deltaX = endX - this.startX
    const deltaY = endY - this.startY
    const deltaTime = endTime - this.startTime

    const velocityX = Math.abs(deltaX) / deltaTime
    const velocityY = Math.abs(deltaY) / deltaTime

    // Verificar se o movimento é suficiente
    if (Math.abs(deltaX) < this.config.threshold && Math.abs(deltaY) < this.config.threshold) {
      return
    }

    // Verificar se a velocidade é suficiente
    if (velocityX < this.config.velocity && velocityY < this.config.velocity) {
      return
    }

    // Determinar direção
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Movimento horizontal
      if (deltaX > 0) {
        onSwipe('right')
      } else {
        onSwipe('left')
      }
    } else {
      // Movimento vertical
      if (deltaY > 0) {
        onSwipe('down')
      } else {
        onSwipe('up')
      }
    }
  }
}

// Utilitário para adicionar efeitos de parallax
export const createParallaxEffect = (element: HTMLElement, intensity: number = 0.5) => {
  const handleScroll = () => {
    const scrolled = window.pageYOffset
    const parallax = scrolled * intensity
    element.style.transform = `translateY(${parallax}px)`
  }

  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}

// Utilitário para animações de entrada
export const animateIn = (element: HTMLElement, delay: number = 0) => {
  element.style.opacity = '0'
  element.style.transform = 'translateY(20px)'
  element.style.transition = 'opacity 0.6s ease, transform 0.6s ease'

  setTimeout(() => {
    element.style.opacity = '1'
    element.style.transform = 'translateY(0)'
  }, delay)
}