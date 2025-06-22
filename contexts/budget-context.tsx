"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

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
  completeBudgetSetup: (incomes: any[], budgetCategories: any[]) => void
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined)

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      description: "Gasolina",
      amount: -120.0,
      type: "expense",
      category: "Transporte",
      date: "2024-01-15",
    },
  ])

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      name: "Carro novo",
      description: "Economizar para comprar um carro novo",
      targetAmount: 30000,
      currentAmount: 5000,
      color: "#8B5CF6",
    },
  ])

  const [categories, setCategories] = useState<Category[]>([
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

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 500) // Mock income

  const totalExpenses = Math.abs(transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0))

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    }
    setTransactions((prev) => [newTransaction, ...prev])
  }

  const addGoal = (goal: Omit<Goal, "id">) => {
    const newGoal = {
      ...goal,
      id: Date.now().toString(),
    }
    setGoals((prev) => [...prev, newGoal])
  }

  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory = {
      ...category,
      id: Date.now().toString(),
    }
    setCategories((prev) => [...prev, newCategory])
  }

  const completeBudgetSetup = (incomes: any[], budgetCategories: any[]) => {
    // Convert budget categories to our category format
    const newCategories = budgetCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      budgetAmount: cat.amount,
      currentAmount: 0,
      color: cat.color,
      icon: "💰",
    }))

    setCategories(newCategories)

    // Store setup completion in localStorage
    localStorage.setItem("poupadin-budget-setup", "completed")
  }

  return (
    <BudgetContext.Provider
      value={{
        transactions,
        goals,
        categories,
        totalIncome,
        totalExpenses,
        addTransaction,
        addGoal,
        addCategory,
        completeBudgetSetup,
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
