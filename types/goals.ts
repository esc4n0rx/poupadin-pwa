// types/goals.ts
export interface Goal {
  id: string
  user_id: string
  name: string
  description?: string
  target_amount: number
  current_amount: number
  monthly_target?: number
  target_date?: string
  color: string
  is_active: boolean
  is_completed: boolean
  completed_at?: string
  created_at: string
  updated_at: string
  progress: number
}

export interface CreateGoalRequest {
  name: string
  description?: string
  target_amount: number
  monthly_target?: number
  target_date?: string
  color?: string
}

export interface UpdateGoalRequest {
  name?: string
  description?: string
  target_amount?: number
  monthly_target?: number
  target_date?: string
  color?: string
  is_active?: boolean
}

export interface GoalTransactionRequest {
  goal_id: string
  transaction_type: 'deposit' | 'withdrawal'
  amount: number
  description?: string
}

export interface GoalTransaction {
  id: string
  goal_id: string
  transaction_type: 'deposit' | 'withdrawal'
  amount: number
  description?: string
  created_at: string
}

export interface GoalsResponse {
  goals: Goal[]
}

export interface GoalResponse {
  goal: Goal
}

export interface GoalStatistics {
  total_goals: number
  active_goals: number
  completed_goals: number
  total_saved: number
  total_target: number
  average_progress: number
}

export interface GoalTransactionResponse {
  message: string
  new_amount: number
  goal: Goal
  completed: boolean
}