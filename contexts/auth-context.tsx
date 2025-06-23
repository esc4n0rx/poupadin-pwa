"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { AuthApi } from "@/lib/auth-api"
import { TokenStorage } from "@/lib/storage"
import { User, LoginRequest, RegisterRequest } from "@/types/auth"
import { ApiException } from "@/types/api"
import { useAuthPersistence } from "@/hooks/use-auth-persistence"

interface AuthContextType {
  user: User | null
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Hook para verificar autenticação persistida
  const {
    isCheckingAuth,
    isAuthenticated: persistedAuth,
    user: persistedUser,
    error: persistenceError
  } = useAuthPersistence()

  // Sincronizar estado com dados persistidos
  useEffect(() => {
    if (!isCheckingAuth) {
      setUser(persistedUser)
      setIsLoading(false)
    }
  }, [isCheckingAuth, persistedUser])

  // Se ainda está verificando autenticação persistida, manter loading
  useEffect(() => {
    setIsLoading(isCheckingAuth)
  }, [isCheckingAuth])

  const login = async (data: LoginRequest) => {
    try {
      setIsLoading(true)
      const response = await AuthApi.login(data)
      setUser(response.user)
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(error.message)
      }
      throw new Error('Erro interno. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      setIsLoading(true)
      const response = await AuthApi.register(data)
      // Após registro, fazer login automaticamente
      await login({
        email: data.email,
        password: data.password,
      })
    } catch (error) {
      if (error instanceof ApiException) {
        // Tratar erros específicos da API
        if (error.status === 409) {
          throw new Error('Este e-mail já está em uso.')
        }
        if (error.status === 400) {
          throw new Error(error.message || 'Dados inválidos.')
        }
        throw new Error(error.message)
      }
      throw new Error('Erro interno. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await AuthApi.logout()
    } catch (error) {
      console.warn('Erro ao fazer logout no servidor:', error)
    } finally {
      setUser(null)
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      TokenStorage.setUserData(updatedUser)
    }
  }

  // Mostrar erro de persistência se houver
  useEffect(() => {
    if (persistenceError) {
      console.error('Erro de autenticação persistida:', persistenceError)
    }
  }, [persistenceError])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user || persistedAuth,
        isLoading,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}