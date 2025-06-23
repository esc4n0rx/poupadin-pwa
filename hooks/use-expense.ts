"use client"

import { useState } from 'react'
import { ExpenseApi } from '@/lib/expense-api'
import { CreateExpenseRequest } from '@/types/expense'

export function useExpense() {
  const [loading, setLoading] = useState(false)

  const createExpense = async (data: CreateExpenseRequest) => {
    setLoading(true)
    try {
      const response = await ExpenseApi.createExpense(data)
      return response
    } catch (error) {
      console.error('Erro ao criar despesa:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    createExpense,
    loading
  }
}