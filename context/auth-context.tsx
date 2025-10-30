// context/auth-context.tsx
"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AuthContextType, AuthUser } from '@/types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar sessão inicial
    const checkSession = async () => {
      try {
        console.log('[AuthContext] Checking initial session')
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          if (data.authenticated && data.user) {
            console.log('[AuthContext] User authenticated:', data.user.email)
            setUser(data.user)
          } else {
            console.log('[AuthContext] No authenticated user')
            setUser(null)
          }
        } else {
          console.log('[AuthContext] Verification failed')
          setUser(null)
        }
      } catch (error) {
        console.error('[AuthContext] Erro ao verificar sessão:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('[AuthContext] signUp started')
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.log('[AuthContext] signUp error:', data.error)
        return { error: new Error(data.error || 'Erro ao criar conta') }
      }

      console.log('[AuthContext] signUp success')
      setUser(data.user)
      
      // Redirecionar após pequeno delay
      setTimeout(() => {
        console.log('[AuthContext] Redirecting to /home')
        router.push('/home')
      }, 100)

      return { error: null }
    } catch (error) {
      console.log('[AuthContext] signUp exception:', error)
      return { error: error as Error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('[AuthContext] signIn started')
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.log('[AuthContext] signIn error:', data.error)
        return { error: new Error(data.error || 'Erro ao fazer login') }
      }

      console.log('[AuthContext] signIn success')
      setUser(data.user)
      
      // Redirecionar após pequeno delay
      setTimeout(() => {
        console.log('[AuthContext] Redirecting to /home')
        router.push('/home')
      }, 100)

      return { error: null }
    } catch (error) {
      console.log('[AuthContext] signIn exception:', error)
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    try {
      console.log('[AuthContext] signOut started')
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      
      setUser(null)
      console.log('[AuthContext] User cleared, redirecting to /login')
      router.push('/login')
    } catch (error) {
      console.error('[AuthContext] Erro ao fazer logout:', error)
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}