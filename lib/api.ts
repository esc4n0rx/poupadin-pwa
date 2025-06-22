import { ApiException } from '@/types/api'
import { TokenStorage } from './storage'
import { AuthResponse } from '@/types/auth'

const API_BASE_URL = 'https://api.poupadin.space/api'

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean
}

class ApiClient {
  private isRefreshing = false
  private refreshPromise: Promise<string> | null = null

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { requiresAuth = false, ...requestConfig } = config
    
    const url = `${API_BASE_URL}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(requestConfig.headers as Record<string, string>),
    }

    // Adicionar token de acesso se necessário
    if (requiresAuth) {
      const accessToken = TokenStorage.getAccessToken()
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`
      }
    }

    try {
      const response = await fetch(url, {
        ...requestConfig,
        headers,
      })

      // Se recebeu 401 e temos refresh token, tentar renovar
      if (response.status === 401 && requiresAuth && TokenStorage.getRefreshToken()) {
        const errorData = await response.clone().json().catch(() => ({}))
        
        if (errorData.code === 'ACCESS_TOKEN_EXPIRED') {
          const newAccessToken = await this.refreshAccessToken()
          
          // Retry da requisição original com novo token
          headers.Authorization = `Bearer ${newAccessToken}`
          const retryResponse = await fetch(url, {
            ...requestConfig,
            headers,
          })
          
          return this.handleResponse<T>(retryResponse)
        }
      }

      return this.handleResponse<T>(response)
    } catch (error) {
      if (error instanceof ApiException) {
        throw error
      }
      
      throw new ApiException({
        message: 'Erro de conexão. Verifique sua internet.',
        status: 0,
      })
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')
    const hasJson = contentType?.includes('application/json')
    
    const data = hasJson ? await response.json() : await response.text()

    if (!response.ok) {
      throw new ApiException({
        message: data.message || 'Erro na requisição',
        code: data.code,
        errors: data.errors,
        status: response.status,
      })
    }

    return data
  }

  private async refreshAccessToken(): Promise<string> {
    // Se já está refreshing, aguardar o processo atual
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise
    }

    this.isRefreshing = true
    this.refreshPromise = this.performRefresh()

    try {
      const newToken = await this.refreshPromise
      return newToken
    } finally {
      this.isRefreshing = false
      this.refreshPromise = null
    }
  }

  private async performRefresh(): Promise<string> {
    const refreshToken = TokenStorage.getRefreshToken()
    
    if (!refreshToken) {
      throw new ApiException({
        message: 'Token de refresh não encontrado',
        status: 401,
      })
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        // Se refresh falhou, limpar tokens e redirecionar para login
        TokenStorage.clearAll()
        window.location.href = '/auth/login'
        throw new ApiException({
          message: 'Sessão expirada',
          status: 401,
        })
      }

      const data: AuthResponse = await response.json()
      
      // Salvar novos tokens
      TokenStorage.setAccessToken(data.accessToken)
      TokenStorage.setRefreshToken(data.refreshToken)
      TokenStorage.setUserData(data.user)

      return data.accessToken
    } catch (error) {
      TokenStorage.clearAll()
      window.location.href = '/auth/login'
      throw error
    }
  }

  // Métodos públicos
  async get<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      requiresAuth,
    })
  }

  async post<T>(
    endpoint: string,
    data?: any,
    requiresAuth = false
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      requiresAuth,
    })
  }

  async put<T>(
    endpoint: string,
    data?: any,
    requiresAuth = false
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      requiresAuth,
    })
  }

  async delete<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      requiresAuth,
    })
  }
}

export const apiClient = new ApiClient()