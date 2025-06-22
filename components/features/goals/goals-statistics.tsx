// components/features/goals/goals-statistics.tsx
"use client"

import { GoalStatistics } from '@/types/goals'
import { formatCurrency } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Target, CheckCircle, Wallet, TrendingUp } from 'lucide-react'

interface GoalsStatisticsProps {
  statistics: GoalStatistics | null
}

export function GoalsStatistics({ statistics }: GoalsStatisticsProps) {
  // Valores padrão para evitar erros quando statistics é null ou undefined
  const safeStatistics = {
    total_goals: statistics?.total_goals ?? 0,
    completed_goals: statistics?.completed_goals ?? 0,
    total_saved: statistics?.total_saved ?? 0,
    average_progress: statistics?.average_progress ?? 0,
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-[#E8F8F5] rounded-full flex items-center justify-center">
            <Target className="w-6 h-6 text-[#1DD1A1]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#2C3E50]">{safeStatistics.total_goals}</p>
            <p className="text-sm text-[#7F8C8D]">Total de Objetivos</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#2C3E50]">{safeStatistics.completed_goals}</p>
            <p className="text-sm text-[#7F8C8D]">Concluídos</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#2C3E50]">{formatCurrency(safeStatistics.total_saved)}</p>
            <p className="text-sm text-[#7F8C8D]">Total Poupado</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#2C3E50]">{safeStatistics.average_progress.toFixed(1)}%</p>
            <p className="text-sm text-[#7F8C8D]">Progresso Médio</p>
          </div>
        </div>
      </Card>
    </div>
  )
}