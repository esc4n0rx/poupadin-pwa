
"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LoginForm } from './login-form'
import { RegisterForm } from './register-form'
import { ForgotPasswordFlow } from './forgot-password-flow'

export type AuthView = 'login' | 'register' | 'forgot-password'

interface AuthContainerProps {
  initialView?: AuthView
}

export function AuthContainer({ initialView = 'login' }: AuthContainerProps) {
  const [currentView, setCurrentView] = useState<AuthView>(initialView)
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  const navigateToView = (view: AuthView) => {
    if (view === currentView) return
    
    // Determinar direção da animação
    const viewOrder: AuthView[] = ['login', 'register', 'forgot-password']
    const currentIndex = viewOrder.indexOf(currentView)
    const targetIndex = viewOrder.indexOf(view)
    
    setDirection(targetIndex > currentIndex ? 'right' : 'left')
    setCurrentView(view)
  }

  const slideVariants = {
    enter: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? '-100%' : '100%',
      opacity: 0,
    }),
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return (
          <LoginForm 
            onNavigateToRegister={() => navigateToView('register')}
            onNavigateToForgotPassword={() => navigateToView('forgot-password')}
          />
        )
      case 'register':
        return (
          <RegisterForm 
            onNavigateToLogin={() => navigateToView('login')}
          />
        )
      case 'forgot-password':
        return (
          <ForgotPasswordFlow 
            onNavigateToLogin={() => navigateToView('login')}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F4F3] flex flex-col relative overflow-hidden">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentView}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.3,
          }}
          className="flex-1 w-full"
        >
          {renderCurrentView()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}