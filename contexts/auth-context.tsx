"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  birthDate: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem("poupadin-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Simulação de login - em produção seria uma chamada à API
    const mockUser: User = {
      id: "1",
      name: "Paulo Maurici",
      email: email,
      birthDate: "1990-01-01",
    }

    setUser(mockUser)
    localStorage.setItem("poupadin-user", JSON.stringify(mockUser))
  }

  const register = async (userData: any) => {
    // Simulação de registro - em produção seria uma chamada à API
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      birthDate: userData.birthDate,
    }

    setUser(newUser)
    localStorage.setItem("poupadin-user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("poupadin-user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
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
