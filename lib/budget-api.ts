import { apiClient } from './api'
import { BudgetSetupRequest, BudgetSetupResponse, BudgetSetupStatus } from '@/types/budget'

export class BudgetApi {
  static async getSetupStatus(): Promise<BudgetSetupStatus> {
    return apiClient.get<BudgetSetupStatus>('/budget/setup-status', true)
  }

  static async createInitialBudget(data: BudgetSetupRequest): Promise<BudgetSetupResponse> {
    return apiClient.post<BudgetSetupResponse>('/budget/setup', data, true)
  }
}