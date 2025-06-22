"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { AuthApi } from "@/lib/auth-api"
import { TokenStorage } from "@/lib/storage"
import { User, LoginRequest, RegisterRequest } from "@/types/auth"
import { ApiException } from "@/types/api"

interface AuthContextType {
  user: User | null
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = TokenStorage.getUserData()
    if (savedUser && TokenStorage.hasTokens()) {
      setUser(savedUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (data: LoginRequest) => {
    try {
      const response = await AuthApi.login(data)
      setUser(response.user)
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(error.message)
      }
      throw new Error('Erro interno. Tente novamente.')
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
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
    }
  }

  const logout = () => {
    AuthApi.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading,
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