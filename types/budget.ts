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

export interface BudgetSetupRequest {
  name?: string
  incomes: {
    description: string
    amount: number
    receive_day: number
  }[]
  categories: {
    name: string
    allocated_amount: number
    color?: string
  }[]
}

export interface BudgetSetupResponse {
  message: string
  budget: {
    id: string
    name: string
    total_income: number
    allocated_amount: number
    available_balance: number
  }
}

export interface BudgetSetupStatus {
  setup_completed: boolean
  message: string
}