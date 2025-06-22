"use client"

import { Bell, Wallet, TrendingDown, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useBudget } from "@/contexts/budget-context"
import { formatCurrency } from "@/lib/utils"
import { BottomNavigation } from "@/components/features/navigation/bottom-navigation"

export function DashboardScreen() {
  const { user } = useAuth()
  const { totalIncome, totalExpenses, goals, transactions } = useBudget()

  const progressPercentage = (totalExpenses / totalIncome) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1DD1A1] to-[#00A085] pb-20">
      {/* Header */}
      <div className="p-6 text-white">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-white/80 text-sm">Olá, Bem-vindo de Volta</p>
            <h1 className="text-2xl font-bold">{user?.name || "Paulo Maurici"}...</h1>
          </div>
          <Bell className="w-6 h-6" />
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-white/20 border-0 text-white">
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

          <Card className="bg-white/20 border-0 text-white">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Total de Despesas</p>
                <p className="text-xl font-bold">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Progresso de Gastos */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-white text-sm">Progresso de Gastos</p>
            <p className="text-white font-semibold">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="bg-[#F0F4F3] rounded-t-3xl min-h-[50vh] p-6">
        {/* Meta em Destaque */}
        {goals.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#1DD1A1] text-sm font-medium">2 de 2</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-300 rounded-full" />
                <div className="w-2 h-2 bg-[#1DD1A1] rounded-full" />
              </div>
            </div>

            <Card className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">🚗</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#2C3E50] mb-1">{goals[0].name}</h3>
                  <p className="text-sm text-[#7F8C8D] mb-2">14.3% concluído</p>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#1DD1A1] flex items-center">
                        <Wallet className="w-4 h-4 mr-1" />
                        Valor Atual
                      </span>
                      <span className="font-semibold">{formatCurrency(goals[0].currentAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#1DD1A1] flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Falta Alcançar
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(goals[0].targetAmount - goals[0].currentAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${(goals[0].currentAmount / goals[0].targetAmount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
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

          <div className="space-y-3">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">⛽</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-[#2C3E50]">{transaction.description}</h4>
                    <p className="text-sm text-[#7F8C8D]">{transaction.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-500">{formatCurrency(transaction.amount)}</p>
                    <p className="text-xs text-[#7F8C8D]">Hoje</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
