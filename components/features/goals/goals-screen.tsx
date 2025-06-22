// components/features/goals/goals-screen.tsx
"use client"

import { useState } from 'react'
import { Plus, List, BarChart3, ArrowLeft } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BottomNavigation } from '@/components/features/navigation/bottom-navigation'
import { GoalCard } from './goal-card'
import { GoalsStatistics } from './goals-statistics'
import { AddGoalModal } from './add-goal-modal'
import { AddGoalTransactionModal } from './add-goal-transaction-modal'
import { useGoals } from '@/hooks/use-goals'
import { CreateGoalRequest, GoalTransactionRequest, Goal } from '@/types/goals'

export function GoalsScreen() {
  const { goals, statistics, loading, error, createGoal, addGoalTransaction } = useGoals()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'statistics'>('list')
  const [activeFilter, setActiveFilter] = useState<'active' | 'inactive'>('active')

  const activeGoals = goals.filter(goal => goal.is_active && !goal.is_completed)
  const inactiveGoals = goals.filter(goal => !goal.is_active || goal.is_completed)
  const displayedGoals = activeFilter === 'active' ? activeGoals : inactiveGoals

  const handleCreateGoal = async (goalData: CreateGoalRequest) => {
    try {
      await createGoal(goalData)
    } catch (error) {
      console.error('Erro ao criar objetivo:', error)
      throw error
    }
  }

  const handleAddTransaction = async (goalId: string) => {
    const goal = goals.find(g => g.id === goalId)
    if (goal) {
      setSelectedGoal(goal)
      setShowTransactionModal(true)
    }
  }

  const handleGoalTransaction = async (data: GoalTransactionRequest) => {
    try {
      const result = await addGoalTransaction(data)
      
      // Mostrar feedback de sucesso
      if (result.completed) {
        // TODO: Mostrar toast de parabéns
        console.log('🎉 Objetivo concluído!')
      }
      
      setShowTransactionModal(false)
      setSelectedGoal(null)
    } catch (error) {
      console.error('Erro ao processar transação:', error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1DD1A1] to-[#00A085] flex items-center justify-center">
        <div className="text-white text-lg">Carregando objetivos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1DD1A1] to-[#00A085] flex items-center justify-center p-6">
        <Card className="p-6 text-center max-w-md">
          <h2 className="text-lg font-bold text-red-600 mb-2">Erro ao Carregar</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1DD1A1] to-[#00A085] pb-20">
      {/* Header */}
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Meus Objetivos</h1>
        <p className="text-white/90 mb-6">
          {activeGoals.length} ativos • {inactiveGoals.length} concluídos
        </p>

        {/* Mode Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="flex bg-white/20 rounded-2xl p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-[#1DD1A1]' 
                  : 'text-white/80'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="font-medium">Lista</span>
            </button>
            <button
              onClick={() => setViewMode('statistics')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                viewMode === 'statistics' 
                  ? 'bg-white text-[#1DD1A1]' 
                  : 'text-white/80'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="font-medium">Estatísticas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#F0F4F3] rounded-t-3xl min-h-[calc(100vh-200px)] p-6">
        {viewMode === 'statistics' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setViewMode('list')}
                className="flex items-center space-x-2 text-[#1DD1A1] hover:text-[#00A085] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Voltar para Lista</span>
              </button>
              <Button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Objetivo</span>
              </Button>
            </div>

            <h2 className="text-xl font-bold text-[#2C3E50] mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2" />
              Estatísticas
            </h2>

            <GoalsStatistics statistics={statistics} />
            
            <div className="mt-8 p-4 bg-blue-50 rounded-2xl">
              <p className="text-blue-700 text-sm font-medium flex items-center">
                <span className="mr-2">💡</span>
                Comece a fazer depósitos em seus objetivos para ver estatísticas mensais!
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Filter Tabs */}
            <div className="flex space-x-1 mb-6 bg-white rounded-2xl p-1">
              <button
                onClick={() => setActiveFilter('active')}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
                  activeFilter === 'active'
                    ? 'bg-[#E8F8F5] text-[#1DD1A1]'
                    : 'text-[#7F8C8D]'
                }`}
              >
                Ativos ({activeGoals.length})
              </button>
              <button
                onClick={() => setActiveFilter('inactive')}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
                  activeFilter === 'inactive'
                    ? 'bg-[#E8F8F5] text-[#1DD1A1]'
                    : 'text-[#7F8C8D]'
                }`}
              >
                Inativos ({inactiveGoals.length})
              </button>
            </div>

            {/* New Goal Button */}
            <Button
              onClick={() => setShowAddModal(true)}
              className="w-full mb-6 bg-[#1DD1A1] text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Objetivo
            </Button>

            {/* Goals List */}
            {displayedGoals.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#E8F8F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl">🎯</div>
                </div>
                <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">
                  {activeFilter === 'active' ? 'Nenhum objetivo ativo' : 'Nenhum objetivo concluído'}
                </h3>
                <p className="text-[#7F8C8D] mb-6">
                  {activeFilter === 'active' 
                    ? 'Crie seu primeiro objetivo para começar a poupar!' 
                    : 'Complete alguns objetivos para vê-los aqui.'
                  }
                </p>
                {activeFilter === 'active' && (
                  <Button onClick={() => setShowAddModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Objetivo
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {displayedGoals.map((goal) => (
                  <GoalCard 
                    key={goal.id} 
                    goal={goal}
                    onAddTransaction={activeFilter === 'active' ? handleAddTransaction : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNavigation />

      {/* Modals */}
      {showAddModal && (
        <AddGoalModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleCreateGoal}
        />
      )}

      {showTransactionModal && selectedGoal && (
        <AddGoalTransactionModal
          goal={selectedGoal}
          onClose={() => {
            setShowTransactionModal(false)
            setSelectedGoal(null)
          }}
          onAddTransaction={handleGoalTransaction}
        />
      )}
    </div>
  )
}