// lib/goals-api.ts
import { apiClient } from './api'
import {
  GoalsResponse,
  GoalResponse,
  CreateGoalRequest,
  UpdateGoalRequest,
  GoalTransactionRequest,
  GoalTransactionResponse,
  GoalStatistics,
  GoalTransaction
} from '@/types/goals'

export class GoalsApi {
  static async getGoals(includeInactive: boolean = false): Promise<GoalsResponse> {
    const endpoint = `/goals${includeInactive ? '?include_inactive=true' : ''}`
    return apiClient.get<GoalsResponse>(endpoint, true)
  }

  static async getGoalById(id: string): Promise<GoalResponse> {
    return apiClient.get<GoalResponse>(`/goals/${id}`, true)
  }

  static async createGoal(data: CreateGoalRequest): Promise<GoalResponse> {
    return apiClient.post<GoalResponse>('/goals', data, true)
  }

  static async updateGoal(id: string, data: UpdateGoalRequest): Promise<GoalResponse> {
    return apiClient.put<GoalResponse>(`/goals/${id}`, data, true)
  }

  static async deleteGoal(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/goals/${id}`, true)
  }

  static async createGoalTransaction(data: GoalTransactionRequest): Promise<GoalTransactionResponse> {
    return apiClient.post<GoalTransactionResponse>('/goals/transaction', data, true)
  }

  static async completeGoal(id: string): Promise<GoalResponse> {
    return apiClient.post<GoalResponse>(`/goals/${id}/complete`, {}, true)
  }

  static async getGoalTransactions(id: string, limit: number = 50): Promise<{ transactions: GoalTransaction[] }> {
    return apiClient.get<{ transactions: GoalTransaction[] }>(`/goals/${id}/transactions?limit=${limit}`, true)
  }

  static async getStatistics(): Promise<{ statistics: GoalStatistics }> {
    return apiClient.get<{ statistics: GoalStatistics }>('/goals/statistics', true)
  }

  static async getReport(): Promise<{ report: any }> {
    return apiClient.get<{ report: any }>('/goals/report', true)
  }
}