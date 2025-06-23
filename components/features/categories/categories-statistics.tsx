"use client"

import { BudgetCategory } from '@/types/expense'
import { formatCurrency } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Wallet, TrendingDown, DollarSign, BarChart3 } from 'lucide-react'

interface CategoriesStatisticsProps {
  categories: BudgetCategory[]
}

export function CategoriesStatistics({ categories }: CategoriesStatisticsProps) {
  // Calcular estatísticas
  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.allocated_amount, 0)
  const totalAvailable = categories.reduce((sum, cat) => sum + cat.current_balance, 0)
  const totalSpent = totalBudgeted - totalAvailable
  const spentPercentage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0

  // Encontrar categoria mais e menos usada
  const categoriesWithUsage = categories.map(cat => ({
    ...cat,
    spentAmount: cat.allocated_amount - cat.current_balance,
    spentPercentage: cat.allocated_amount > 0 ? ((cat.allocated_amount - cat.current_balance) / cat.allocated_amount) * 100 : 0
  })).filter(cat => cat.allocated_amount > 0)

  const mostUsedCategory = categoriesWithUsage.reduce((prev, current) => 
    prev.spentPercentage > current.spentPercentage ? prev : current, categoriesWithUsage[0])

  const leastUsedCategory = categoriesWithUsage.reduce((prev, current) => 
    prev.spentPercentage < current.spentPercentage ? prev : current, categoriesWithUsage[0])

  return (
    <div className="space-y-6">
      {/* Resumo Financeiro */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#E8F8F5] rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-[#1DD1A1]" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#2C3E50]">{formatCurrency(totalBudgeted)}</p>
              <p className="text-sm text-[#7F8C8D]">Total Orçado</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#2C3E50]">{formatCurrency(totalSpent)}</p>
              <p className="text-sm text-[#7F8C8D]">Total Gasto</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#2C3E50]">{formatCurrency(totalAvailable)}</p>
              <p className="text-sm text-[#7F8C8D]">Disponível</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#2C3E50]">{spentPercentage.toFixed(1)}%</p>
              <p className="text-sm text-[#7F8C8D]">Progresso de Gastos</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Progresso Geral */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#2C3E50]">Progresso de Gastos</h3>
          <span className="text-[#1DD1A1] font-bold">{spentPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="h-3 rounded-full transition-all duration-300"
            style={{ 
              width: `${Math.min(spentPercentage, 100)}%`,
              backgroundColor: spentPercentage > 80 ? '#EF4444' : spentPercentage > 60 ? '#F59E0B' : '#1DD1A1'
            }}
          />
        </div>
        <p className="text-sm text-[#7F8C8D] text-center">
          {spentPercentage < 50 ? '🟢 Você está no controle!' : 
           spentPercentage < 80 ? '🟡 Atenção aos gastos' : 
           '🔴 Cuidado com o orçamento!'}
        </p>
      </Card>

      {/* Categorias com Mais/Menos Gastos */}
      <div className="space-y-4">
        <h3 className="font-semibold text-[#2C3E50] flex items-center">
          🔥 Categorias com Mais Gastos
        </h3>
        
        {mostUsedCategory && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: mostUsedCategory.color }}
                />
                <div>
                  <h4 className="font-medium text-[#2C3E50]">{mostUsedCategory.name}</h4>
                  <p className="text-sm text-[#7F8C8D]">
                    {formatCurrency(mostUsedCategory.spentAmount)} de {formatCurrency(mostUsedCategory.allocated_amount)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-red-500">{mostUsedCategory.spentPercentage.toFixed(1)}%</p>
                <p className="text-sm text-[#7F8C8D]">usado</p>
              </div>
            </div>
          </Card>
        )}

        {leastUsedCategory && mostUsedCategory?.id !== leastUsedCategory?.id && (
          <>
            <h3 className="font-semibold text-[#2C3E50] flex items-center pt-4">
              💎 Categoria Mais Conservadora
            </h3>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: leastUsedCategory.color }}
                  />
                  <div>
                    <h4 className="font-medium text-[#2C3E50]">{leastUsedCategory.name}</h4>
                    <p className="text-sm text-[#7F8C8D]">
                      {formatCurrency(leastUsedCategory.spentAmount)} de {formatCurrency(leastUsedCategory.allocated_amount)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-500">{leastUsedCategory.spentPercentage.toFixed(1)}%</p>
                  <p className="text-sm text-[#7F8C8D]">usado</p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}