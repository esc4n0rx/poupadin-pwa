// components/features/goals/goal-card.tsx
"use client"

import { useState } from 'react'
import { Goal } from '@/types/goals'
import { formatCurrency } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Plus, Wallet, TrendingUp } from 'lucide-react'

interface GoalCardProps {
  goal: Goal
  onAddTransaction?: (goalId: string) => void
}

export function GoalCard({ goal, onAddTransaction }: GoalCardProps) {
  const progressPercentage = Math.min((goal.current_amount / goal.target_amount) * 100, 100)
  const remaining = Math.max(goal.target_amount - goal.current_amount, 0)

  const getGoalEmoji = (name: string) => {
    const lowercaseName = name.toLowerCase()
    if (lowercaseName.includes('carro') || lowercaseName.includes('auto')) return '🚗'
    if (lowercaseName.includes('casa') || lowercaseName.includes('imovel')) return '🏠'
    if (lowercaseName.includes('viagem') || lowercaseName.includes('férias')) return '✈️'
    if (lowercaseName.includes('estudo') || lowercaseName.includes('curso')) return '📚'
    if (lowercaseName.includes('emergência') || lowercaseName.includes('reserva')) return '🛡️'
    return '🎯'
  }

  return (
    <Card className="p-4">
      <div className="flex items-center space-x-4">
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `${goal.color}20` }}
        >
          <span className="text-2xl">{getGoalEmoji(goal.name)}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-[#2C3E50] mb-1">{goal.name}</h3>
          <p className="text-sm text-[#7F8C8D] mb-2">
            {progressPercentage.toFixed(1)}% concluído
          </p>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#1DD1A1] flex items-center">
                <Wallet className="w-4 h-4 mr-1" />
                Valor Atual
              </span>
              <span className="font-semibold">{formatCurrency(goal.current_amount)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#1DD1A1] flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                Falta Alcançar
              </span>
              <span className="font-semibold">{formatCurrency(remaining)}</span>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${progressPercentage}%`,
                backgroundColor: goal.color
              }}
            />
          </div>

          {onAddTransaction && (
            <button
              onClick={() => onAddTransaction(goal.id)}
              className="mt-3 w-full flex items-center justify-center space-x-2 py-2 px-4 bg-[#E8F8F5] text-[#1DD1A1] rounded-xl hover:bg-[#E8F8F5]/80 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Adicionar Valor</span>
            </button>
          )}
        </div>
      </div>
    </Card>
  )
}