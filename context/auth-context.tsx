"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
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
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          console.log('[AuthContext] Initial session found:', session.user.email)
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata.name || session.user.email!,
            created_at: session.user.created_at,
          }
          setUser(authUser)
        } else {
          console.log('[AuthContext] No initial session')
        }
      } catch (error) {
        console.error('[AuthContext] Erro ao verificar sessão:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AuthContext] onAuthStateChange - event:', event, 'has session:', !!session)
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata.name || session.user.email!,
            created_at: session.user.created_at,
          }
          setUser(authUser)
          console.log('[AuthContext] User set:', authUser.email)
        } else {
          setUser(null)
          console.log('[AuthContext] User cleared')
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('[AuthContext] signUp started')
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) {
        console.log('[AuthContext] signUp error:', error)
        return { error }
      }

      console.log('[AuthContext] signUp success, has session:', !!data.session)

      // Aguardar um momento para a sessão ser estabelecida completamente
      if (data.user && data.session) {
        // Dar tempo para o onAuthStateChange atualizar o estado
        await new Promise(resolve => setTimeout(resolve, 200))
        console.log('[AuthContext] Redirecting to /home')
        router.replace('/home')
      }

      return { error: null }
    } catch (error) {
      console.log('[AuthContext] signUp exception:', error)
      return { error: error as Error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('[AuthContext] signIn started')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.log('[AuthContext] signIn error:', error)
        return { error }
      }

      console.log('[AuthContext] signIn success, has session:', !!data.session)

      // Aguardar um momento para a sessão ser estabelecida completamente
      if (data.session) {
        // Dar tempo para o onAuthStateChange atualizar o estado
        await new Promise(resolve => setTimeout(resolve, 200))
        console.log('[AuthContext] Redirecting to /home')
        router.replace('/home')
      }

      return { error: null }
    } catch (error) {
      console.log('[AuthContext] signIn exception:', error)
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
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