export interface BudgetCategory {
  id: string
  budget_id: string
  name: string
  allocated_amount: number
  current_balance: number
  color: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CategoriesResponse {
  categories: BudgetCategory[]
}

export interface CreateExpenseRequest {
  category_id: string
  amount: number
  description: string
}

export interface CreateExpenseResponse {
  message: string
  expense: {
    id: string
    category_id: string
    amount: number
    description: string
    created_at: string
  }
}

export interface MonthSummary {
  total_expenses: number
  transaction_count: number
  budget_usage_percentage: number
}