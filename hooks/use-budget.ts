"use client"

import { useState, useEffect } from 'react'
import { BudgetApi } from '@/lib/budget-api'
import { Budget } from '@/types/budget'

export function useBudget() {
  const [budget, setBudget] = useState<Budget | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBudget = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await BudgetApi.getBudget()
      setBudget(response.budget)
    } catch (err) {
      console.error('Erro ao carregar orçamento:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar orçamento')
      setBudget(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBudget()
  }, [])

  return {
    budget,
    loading,
    error,
    refetch: fetchBudget
  }
}