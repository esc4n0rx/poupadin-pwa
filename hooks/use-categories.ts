"use client"

import { useState, useEffect } from 'react'
import { ExpenseApi } from '@/lib/expense-api'
import { CategoriesApi } from '@/lib/categories-api'
import { BudgetCategory } from '@/types/expense'
import { CategoryTransferRequest } from '@/types/categories'

export function useCategories() {
  const [categories, setCategories] = useState<BudgetCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await ExpenseApi.getCategories()
      setCategories(response.categories || [])
    } catch (err) {
      console.error('Erro ao carregar categorias:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar categorias')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const transferBetweenCategories = async (data: CategoryTransferRequest) => {
    try {
      const response = await CategoriesApi.transferBetweenCategories(data)
      await fetchCategories() // Recarregar categorias após transferência
      return response
    } catch (error) {
      console.error('Erro ao transferir entre categorias:', error)
      throw error
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    transferBetweenCategories
  }
}