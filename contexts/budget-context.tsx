// contexts/budget-context.tsx
"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useTransactions } from "@/hooks/use-transactions"
import { useGoals } from "@/hooks/use-goals"

interface Transaction {
  id: string
  description: string
  amount: number
  type: "income" | "expense"
  category: string
  date: string
}

interface Goal {
  id: string
  name: string
  description: string
  targetAmount: number
  currentAmount: number
  color: string
  deadline?: string
}

interface Category {
  id: string
  name: string
  budgetAmount: number
  currentAmount: number
  color: string
  icon: string
}

interface BudgetContextType {
  transactions: Transaction[]
  goals: Goal[]
  categories: Category[]
  totalIncome: number
  totalExpenses: number
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  addGoal: (goal: Omit<Goal, "id">) => void
  addCategory: (category: Omit<Category, "id">) => void
  loading: boolean
  error: string | null
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined)

export function BudgetProvider({ children }: { children: ReactNode }) {
  // Usar hooks reais para dados da API
  const { transactions: apiTransactions, loading: transactionsLoading, error: transactionsError } = useTransactions({ limit: 50 })
  const { goals: apiGoals, loading: goalsLoading, error: goalsError } = useGoals()

  // Estados locais para compatibilidade com código existente
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>([])
  const [localCategories, setLocalCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Alimentação",
      budgetAmount: 800,
      currentAmount: 450,
      color: "#EF4444",
      icon: "🍽️",
    },
    {
      id: "2",
      name: "Transporte",
      budgetAmount: 400,
      currentAmount: 120,
      color: "#3B82F6",
      icon: "🚗",
    },
  ])

  // Converter dados da API para formato do contexto
  const convertedTransactions: Transaction[] = apiTransactions.map(t => ({
    id: t.id,
    description: t.description,
    amount: t.amount,
    type: t.transaction_type,
    category: t.budget_categories.name,
    date: t.created_at
  }))

  const convertedGoals: Goal[] = apiGoals.map(g => ({
    id: g.id,
    name: g.name,
    description: g.description || '',
    targetAmount: g.target_amount,
    currentAmount: g.current_amount,
    color: g.color,
    deadline: g.target_date
  }))

  // Combinar transações locais e da API
  const allTransactions = [...convertedTransactions, ...localTransactions]
  const allGoals = [...convertedGoals]

  // Mock data para renda total - em produção, isso viria de uma API de orçamento
  const totalIncome = 5000
  const totalExpenses = allTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    }
    setLocalTransactions((prev) => [newTransaction, ...prev])
  }

  const addGoal = (goal: Omit<Goal, "id">) => {
    // Esta função agora é principalmente para compatibilidade
    // Novos objetivos devem ser criados através do hook useGoals
    console.warn('Use o hook useGoals para criar novos objetivos')
  }

  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory = {
      ...category,
      id: Date.now().toString(),
    }
    setLocalCategories((prev) => [...prev, newCategory])
  }

  const loading = transactionsLoading || goalsLoading
  const error = transactionsError || goalsError

  return (
    <BudgetContext.Provider
      value={{
        transactions: allTransactions,
        goals: allGoals,
        categories: localCategories,
        totalIncome,
        totalExpenses,
        addTransaction,
        addGoal,
        addCategory,
        loading,
        error,
      }}
    >
      {children}
    </BudgetContext.Provider>
  )
}

export function useBudget() {
  const context = useContext(BudgetContext)
  if (context === undefined) {
    throw new Error("useBudget must be used within a BudgetProvider")
  }
  return context
}