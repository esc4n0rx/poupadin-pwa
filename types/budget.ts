// Tipos existentes mantidos + novos tipos para orçamento completo
export interface Income {
  id: string
  description: string
  amount: number
  receive_day: number
}

export interface BudgetCategory {
  id: string
  name: string
  allocated_amount: number
  color: string
}

// Novos tipos para a API de orçamento
export interface BudgetIncome {
  id: string
  amount: number
  budget_id: string
  is_active: boolean
  created_at: string
  description: string
  receive_day: number
}

export interface Budget {
  id: string
  user_id: string
  name: string
  total_income: number
  allocated_amount: number
  available_balance: number
  is_active: boolean
  created_at: string
  updated_at: string
  incomes: BudgetIncome[]
}

export interface BudgetResponse {
  budget: Budget
}

// Tipos existentes mantidos
export interface BudgetSetupRequest {
  incomes: Array<{
    description: string
    amount: number
    receive_day: number
  }>
  categories: Array<{
    name: string
    allocated_amount: number
    color: string
  }>
}

export interface BudgetSetupResponse {
  message: string
  budget: {
    id: string
    total_income: number
    allocated_amount: number
    available_balance: number
  }
}

export interface BudgetSetupStatus {
  has_budget: boolean
  budget_id?: string
  setup_completed: boolean
}