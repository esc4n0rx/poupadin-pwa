// lib/transactions-api.ts
import { apiClient } from './api'
import { TransactionsResponse, TransactionFilters } from '@/types/transactions'

export class TransactionsApi {
  static async getTransactions(filters: TransactionFilters = {}): Promise<TransactionsResponse> {
    const params = new URLSearchParams()
    
    if (filters.limit) params.append('limit', filters.limit.toString())
    if (filters.offset) params.append('offset', filters.offset.toString())
    if (filters.category_id) params.append('category_id', filters.category_id)
    if (filters.transaction_type) params.append('transaction_type', filters.transaction_type)
    if (filters.start_date) params.append('start_date', filters.start_date)
    if (filters.end_date) params.append('end_date', filters.end_date)

    const queryString = params.toString()
    const endpoint = `/budget/transactions${queryString ? `?${queryString}` : ''}`
    
    return apiClient.get<TransactionsResponse>(endpoint, true)
  }
}