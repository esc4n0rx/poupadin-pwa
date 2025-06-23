import { apiClient } from './api'
import { TokenStorage } from './storage'
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  LogoutRequest,
  TokenStatusResponse,
  User,
} from '@/types/auth'

export class AuthApi {
  static async register(data: RegisterRequest): Promise<{ user: User }> {
    // Validar e formatar os dados antes de enviar
    const payload = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      date_of_birth: data.date_of_birth, // Já deve estar em formato YYYY-MM-DD
    }

    // Validações adicionais
    if (payload.name.length < 3) {
      throw new Error('O nome deve ter pelo menos 3 caracteres')
    }

    if (payload.password.length < 8) {
      throw new Error('A senha deve ter pelo menos 8 caracteres')
    }

    // Validar formato de data YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(payload.date_of_birth)) {
      throw new Error('Data de nascimento deve estar no formato YYYY-MM-DD')
    }

    const response = await apiClient.post<{ message: string; user: User }>(
      '/auth/register',
      payload
    )
    return { user: response.user }
  }

  static async login(data: LoginRequest): Promise<AuthResponse> {
    const payload = {
      email: data.email.trim().toLowerCase(),
      password: data.password,
    }

    const response = await apiClient.post<AuthResponse>('/auth/login', payload)
    
    // Salvar tokens e dados do usuário
    TokenStorage.setAccessToken(response.accessToken)
    TokenStorage.setRefreshToken(response.refreshToken)
    TokenStorage.setUserData(response.user)
    
    return response
  }

  static async logout(): Promise<void> {
    const refreshToken = TokenStorage.getRefreshToken()
    
    if (refreshToken) {
      try {
        await apiClient.post('/auth/logout', { refreshToken })
      } catch (error) {
        // Mesmo se logout falhar no servidor, limpar dados locais
        console.warn('Erro no logout:', error)
      }
    }
    
    TokenStorage.clearAll()
  }

  static async logoutAllDevices(): Promise<void> {
    try {
      await apiClient.post('/auth/logout-all', {}, true)
    } catch (error) {
      console.warn('Erro ao fazer logout de todos os dispositivos:', error)
    } finally {
      TokenStorage.clearAll()
    }
  }

  static async getTokenStatus(): Promise<TokenStatusResponse> {
    return apiClient.get<TokenStatusResponse>('/auth/token-status', true)
  }

  static async refreshToken(): Promise<AuthResponse> {
    const refreshToken = TokenStorage.getRefreshToken()
    
    if (!refreshToken) {
      throw new Error('Refresh token não encontrado')
    }

    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    })
    
    // Atualizar tokens salvos
    TokenStorage.setAccessToken(response.accessToken)
    TokenStorage.setRefreshToken(response.refreshToken)
    TokenStorage.setUserData(response.user)
    
    return response
  }

  static getCurrentUser(): User | null {
    return TokenStorage.getUserData()
  }

  static isAuthenticated(): boolean {
    return TokenStorage.isSessionValid()
  }

  static async validateSession(): Promise<boolean> {
    try {
      if (!TokenStorage.hasTokens()) {
        return false
      }

      // Tentar fazer uma chamada autenticada para verificar se a sessão é válida
      await this.getTokenStatus()
      return true
    } catch (error) {
      // Se falhar, tentar refresh
      try {
        await this.refreshToken()
        return true
      } catch (refreshError) {
        // Se refresh também falhar, sessão é inválida
        TokenStorage.clearAll()
        return false
      }
    }
  }
}