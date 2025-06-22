// types/transactions.ts
export interface Transaction {
  id: string
  budget_id: string
  category_id: string
  transaction_type: 'income' | 'expense'
  amount: number
  description: string
  is_recurring: boolean
  created_at: string
  budget_categories: {
    name: string
  }
}

export interface TransactionFilters {
  limit?: number
  offset?: number
  category_id?: string
  transaction_type?: 'income' | 'expense'
  start_date?: string
  end_date?: string
}

export interface TransactionsResponse {
  transactions: Transaction[]
}