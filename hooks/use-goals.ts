// hooks/use-goals.ts
"use client"

import { useState, useEffect } from 'react'
import { GoalsApi } from '@/lib/goals-api'
import { Goal, CreateGoalRequest, UpdateGoalRequest, GoalTransactionRequest, GoalStatistics } from '@/types/goals'

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [statistics, setStatistics] = useState<GoalStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGoals = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await GoalsApi.getGoals()
      setGoals(response.goals || []) // Garantir que sempre seja um array
    } catch (err) {
      console.error('Erro ao carregar objetivos:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar objetivos')
      setGoals([]) // Array vazio em caso de erro
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      const response = await GoalsApi.getStatistics()
      setStatistics(response.statistics || null)
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err)
      // Não definir como erro crítico, apenas log
      setStatistics(null)
    }
  }

  const createGoal = async (data: CreateGoalRequest) => {
    try {
      const response = await GoalsApi.createGoal(data)
      await fetchGoals()
      await fetchStatistics()
      return response.goal
    } catch (err) {
      console.error('Erro ao criar objetivo:', err)
      throw err
    }
  }

  const updateGoal = async (id: string, data: UpdateGoalRequest) => {
    try {
      const response = await GoalsApi.updateGoal(id, data)
      await fetchGoals()
      await fetchStatistics()
      return response.goal
    } catch (err) {
      console.error('Erro ao atualizar objetivo:', err)
      throw err
    }
  }

  const deleteGoal = async (id: string) => {
    try {
      await GoalsApi.deleteGoal(id)
      await fetchGoals()
      await fetchStatistics()
    } catch (err) {
      console.error('Erro ao deletar objetivo:', err)
      throw err
    }
  }

  const addGoalTransaction = async (data: GoalTransactionRequest) => {
    try {
      const response = await GoalsApi.createGoalTransaction(data)
      await fetchGoals()
      await fetchStatistics()
      return response
    } catch (err) {
      console.error('Erro ao adicionar transação:', err)
      throw err
    }
  }

  const completeGoal = async (id: string) => {
    try {
      const response = await GoalsApi.completeGoal(id)
      await fetchGoals()
      await fetchStatistics()
      return response.goal
    } catch (err) {
      console.error('Erro ao completar objetivo:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchGoals()
    fetchStatistics()
  }, [])

  return {
    goals,
    statistics,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    addGoalTransaction,
    completeGoal,
    refetch: fetchGoals
  }
}