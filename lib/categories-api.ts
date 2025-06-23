import { apiClient } from './api'
import { CategoryTransferRequest, CategoryTransferResponse } from '@/types/categories'

export class CategoriesApi {
  static async transferBetweenCategories(data: CategoryTransferRequest): Promise<CategoryTransferResponse> {
    return apiClient.post<CategoryTransferResponse>('/budget/transfer', data, true)
  }
}