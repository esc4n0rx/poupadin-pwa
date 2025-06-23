// components/features/dashboard/dashboard-screen.tsx
"use client"

import { useEffect, useState } from "react"
import { Bell, Wallet, TrendingDown, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { formatCurrency } from "@/lib/utils"
import { BottomNavigation } from "@/components/features/navigation/bottom-navigation"
import { useTransactions } from "@/hooks/use-transactions"
import { useGoals } from "@/hooks/use-goals"
import { useBudget } from "@/hooks/use-budget"
import { GoalCard } from "@/components/features/goals/goal-card"

export function DashboardScreen() {
  const { user } = useAuth()
  const { transactions, loading: transactionsLoading } = useTransactions({ limit: 10 })
  const { goals, loading: goalsLoading } = useGoals()
  const { budget, loading: budgetLoading, error: budgetError } = useBudget()
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0)

  // Usar dados reais do orçamento
  const totalIncome = budget?.total_income || 0
  const availableBalance = budget?.available_balance || 0
  console.log("Total Renda:", totalIncome)
  console.log("Saldo Disponível:", availableBalance)
  
  // Calcular total gasto usando available_balance
  const totalSpent = totalIncome - availableBalance
  console.log("Total Gasto:", totalSpent)
  
  // Calcular percentual de gastos
  const spentPercentage = totalIncome > 0 ? (totalSpent / totalIncome) * 100 : 0

  // Filtrar objetivos ativos para o carrossel
  const activeGoals = goals.filter(goal => goal.is_active && !goal.is_completed)

  // Carrossel automático de objetivos (troca a cada 15 segundos)
  useEffect(() => {
    if (activeGoals.length > 1) {
      const interval = setInterval(() => {
        setCurrentGoalIndex((prevIndex) => 
          prevIndex === activeGoals.length - 1 ? 0 : prevIndex + 1
        )
      }, 15000) // 15 segundos

      return () => clearInterval(interval)
    }
  }, [activeGoals.length])

  // Função para formatar data relativa
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Agora'
    if (diffInHours < 24) return `${diffInHours}h atrás`
    if (diffInHours < 48) return 'Ontem'
    return `${Math.floor(diffInHours / 24)} dias atrás`
  }

  // Função para obter emoji da categoria
  const getCategoryEmoji = (categoryName: string) => {
    const name = categoryName.toLowerCase()
    if (name.includes('alimentação') || name.includes('comida')) return '🍽️'
    if (name.includes('transporte') || name.includes('combustível')) return '⛽'
    if (name.includes('lazer') || name.includes('entretenimento')) return '🎬'
    if (name.includes('saúde')) return '⚕️'
    if (name.includes('educação') || name.includes('estudo')) return '📚'
    if (name.includes('casa') || name.includes('moradia')) return '🏠'
    if (name.includes('compras')) return '🛍️'
    return '💰'
  }

  // Loading state para orçamento
  if (budgetLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1DD1A1] to-[#00A085] flex items-center justify-center">
        <div className="text-white text-lg">Carregando orçamento...</div>
      </div>
    )
  }

  // Error state para orçamento
  if (budgetError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1DD1A1] to-[#00A085] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Erro ao Carregar Orçamento</h2>
          <p className="text-gray-600 mb-6">{budgetError}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-[#1DD1A1] text-white py-3 rounded-2xl font-medium"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1DD1A1] to-[#00A085] pb-20">
      {/* Header */}
      <div className="p-6 text-white">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-white/80 text-sm">Olá, Bem-vindo de Volta</p>
            <h1 className="text-2xl font-bold">{user?.name || "Usuário"}...</h1>
          </div>
          <Bell className="w-6 h-6" />
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-white/20 border-0 text-white p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Renda Total</p>
                <p className="text-xl font-bold">{formatCurrency(totalIncome)}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white/20 border-0 text-white p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Total Gasto</p>
                <p className="text-xl font-bold">{formatCurrency(totalSpent)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Progresso de Gastos */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-white text-sm">Gastos do Mês</p>
            <p className="text-white font-semibold">{formatCurrency(availableBalance)} disponível</p>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <p className="text-white/70 text-xs">{spentPercentage.toFixed(1)}% da renda gasta</p>
            <p className="text-white/70 text-xs">{formatCurrency(totalIncome)}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="bg-[#F0F4F3] rounded-t-3xl min-h-[50vh] p-6">
        {/* Meta em Destaque com Carrossel */}
        {activeGoals.length > 0 && !goalsLoading && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#1DD1A1] text-sm font-medium">
                {currentGoalIndex + 1} de {activeGoals.length}
              </span>
              <div className="flex space-x-1">
                {activeGoals.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentGoalIndex ? 'bg-[#1DD1A1]' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentGoalIndex * 100}%)` }}
              >
                {activeGoals.map((goal) => (
                  <div key={goal.id} className="w-full flex-shrink-0">
                    <GoalCard goal={goal} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filtros de Período */}
        <div className="flex space-x-2 mb-6">
          <button className="px-4 py-2 text-[#7F8C8D] bg-white rounded-full text-sm">Diário</button>
          <button className="px-4 py-2 text-[#7F8C8D] bg-white rounded-full text-sm">Semanal</button>
          <button className="px-6 py-2 text-white bg-[#1DD1A1] rounded-full text-sm font-medium">Mensal</button>
        </div>

        {/* Transações Recentes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#2C3E50] flex items-center">
              <span className="text-2xl mr-2">💰</span>
              Transações Recentes
            </h3>
            <span className="text-sm text-[#7F8C8D]">{transactions.length} transações</span>
          </div>

          {transactionsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-4 rounded-2xl animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#E8F8F5] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Nenhuma transação encontrada</h3>
              <p className="text-[#7F8C8D]">Suas transações aparecerão aqui conforme forem registradas.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">{getCategoryEmoji(transaction.budget_categories.name)}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[#2C3E50]">{transaction.description}</h4>
                      <p className="text-sm text-[#7F8C8D]">{transaction.budget_categories.name}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.transaction_type === 'expense' ? 'text-red-500' : 'text-green-500'
                      }`}>
                        {transaction.transaction_type === 'expense' ? '-' : '+'}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-[#7F8C8D]">{getRelativeTime(transaction.created_at)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}