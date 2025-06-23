import { apiClient } from './api'
import { CategoriesResponse, CreateExpenseRequest, CreateExpenseResponse } from '@/types/expense'

export class ExpenseApi {
  static async getCategories(): Promise<CategoriesResponse> {
    return apiClient.get<CategoriesResponse>('/budget/categories', true)
  }

  static async createExpense(data: CreateExpenseRequest): Promise<CreateExpenseResponse> {
    return apiClient.post<CreateExpenseResponse>('/budget/expense', data, true)
  }
}