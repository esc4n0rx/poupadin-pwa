"use client"

import { useEffect, useState } from 'react'
import { AuthApi } from '@/lib/auth-api'
import { TokenStorage } from '@/lib/storage'
import { User } from '@/types/auth'

interface AuthPersistenceState {
  isCheckingAuth: boolean
  isAuthenticated: boolean
  user: User | null
  error: string | null
}

export function useAuthPersistence() {
  const [state, setState] = useState<AuthPersistenceState>({
    isCheckingAuth: true,
    isAuthenticated: false,
    user: null,
    error: null
  })

  useEffect(() => {
    checkPersistedAuth()
  }, [])

  const checkPersistedAuth = async () => {
    try {
      setState(prev => ({ ...prev, isCheckingAuth: true, error: null }))

      // Verificar se temos tokens salvos
      const hasTokens = TokenStorage.hasTokens()
      
      if (!hasTokens) {
        setState({
          isCheckingAuth: false,
          isAuthenticated: false,
          user: null,
          error: null
        })
        return
      }

      // Tentar obter dados do usuário salvos
      const savedUser = TokenStorage.getUserData()
      
      if (savedUser) {
        // Verificar se o token ainda é válido fazendo uma chamada para a API
        try {
          const tokenStatus = await AuthApi.getTokenStatus()
          
          setState({
            isCheckingAuth: false,
            isAuthenticated: true,
            user: savedUser,
            error: null
          })
          
          return
        } catch (tokenError) {
          // Token inválido, tentar refresh
          console.log('Token inválido, tentando refresh...')
        }
      }

      // Tentar fazer refresh do token
      try {
        const refreshResult = await AuthApi.refreshToken()
        
        setState({
          isCheckingAuth: false,
          isAuthenticated: true,
          user: refreshResult.user,
          error: null
        })
      } catch (refreshError) {
        // Refresh falhou, limpar dados e considerar não autenticado
        console.log('Refresh falhou:', refreshError)
        TokenStorage.clearAll()
        
        setState({
          isCheckingAuth: false,
          isAuthenticated: false,
          user: null,
          error: null
        })
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação persistida:', error)
      TokenStorage.clearAll()
      
      setState({
        isCheckingAuth: false,
        isAuthenticated: false,
        user: null,
        error: error instanceof Error ? error.message : 'Erro de autenticação'
      })
    }
  }

  const clearAuth = () => {
    TokenStorage.clearAll()
    setState({
      isCheckingAuth: false,
      isAuthenticated: false,
      user: null,
      error: null
    })
  }

  return {
    ...state,
    recheckAuth: checkPersistedAuth,
    clearAuth
  }
}