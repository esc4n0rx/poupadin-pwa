// contexts/auth-context.tsx
"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { AuthApi } from "@/lib/auth-api"
import { ForgotPasswordApi } from "@/lib/forgot-password-api"
import { TokenStorage } from "@/lib/storage"
import { User, LoginRequest, RegisterRequest } from "@/types/auth"
// contexts/auth-context.tsx (continuação)
import { 
 ForgotPasswordRequest, 
 VerifyResetCodeRequest, 
 ResetPasswordRequest
} from "@/types/forgot-password"
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
 // Métodos de recuperação de senha
 sendResetCode: (data: ForgotPasswordRequest) => Promise<{ message: string; instruction: string }>
 verifyResetCode: (data: VerifyResetCodeRequest) => Promise<{ message: string; valid: boolean }>
 resetPassword: (data: ResetPasswordRequest) => Promise<{ message: string; success: boolean }>
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

 const logout = () => {
   try {
     AuthApi.logout()
     setUser(null)
   } catch (error) {
     console.error('Erro no logout:', error)
     // Mesmo com erro, limpar estado local
     setUser(null)
     TokenStorage.clearAll()
   }
 }

 const updateUser = (userData: Partial<User>) => {
   if (user) {
     const updatedUser = { ...user, ...userData }
     setUser(updatedUser)
     TokenStorage.setUserData(updatedUser)
   }
 }

 // Métodos de recuperação de senha
 const sendResetCode = async (data: ForgotPasswordRequest) => {
   try {
     return await ForgotPasswordApi.sendResetCode(data)
   } catch (error) {
     if (error instanceof ApiException) {
       throw new Error(error.message)
     }
     throw new Error('Erro ao enviar código de recuperação.')
   }
 }

 const verifyResetCode = async (data: VerifyResetCodeRequest) => {
   try {
     return await ForgotPasswordApi.verifyResetCode(data)
   } catch (error) {
     if (error instanceof ApiException) {
       throw new Error(error.message)
     }
     throw new Error('Erro ao verificar código.')
   }
 }

 const resetPassword = async (data: ResetPasswordRequest) => {
   try {
     return await ForgotPasswordApi.resetPassword(data)
   } catch (error) {
     if (error instanceof ApiException) {
       throw new Error(error.message)
     }
     throw new Error('Erro ao redefinir senha.')
   }
 }

 const isAuthenticated = !!user

 return (
   <AuthContext.Provider
     value={{
       user,
       login,
       register,
       logout,
       isAuthenticated,
       isLoading,
       updateUser,
       sendResetCode,
       verifyResetCode,
       resetPassword,
     }}
   >
     {children}
   </AuthContext.Provider>
 )
}

export function useAuth() {
 const context = useContext(AuthContext)
 if (context === undefined) {
   throw new Error('useAuth must be used within an AuthProvider')
 }
 return context
}