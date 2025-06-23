export interface CategoryTransferRequest {
  from_category_id: string
  to_category_id: string
  amount: number
  description: string
}

export interface CategoryTransferResponse {
  message: string
  from_new_balance: number
  to_new_balance: number
}

export interface CategoryStatistics {
  total_budgeted: number
  total_spent: number
  total_available: number
  categories_count: number
  most_used_category: {
    name: string
    spent_amount: number
    percentage: number
  } | null
  least_used_category: {
    name: string
    spent_amount: number
    percentage: number
  } | null
}