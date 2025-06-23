"use client"

import { useState } from 'react'
import { Plus, Receipt, TrendingDown, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BottomNavigation } from '@/components/features/navigation/bottom-navigation'
import { RegisterExpenseModal } from './register-expense-modal'
import { useCategories } from '@/hooks/use-categories'
import { useExpense } from '@/hooks/use-expense'
import { useTransactions } from '@/hooks/use-transactions'
import { CreateExpenseRequest } from '@/types/expense'
import { formatCurrency } from '@/lib/utils'

export function ExpenseScreen() {
  const [showModal, setShowModal] = useState(false)
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const { createExpense } = useExpense()
  const { transactions, loading: transactionsLoading } = useTransactions({ 
    limit: 10,
    transaction_type: 'expense'
  })

  // Calcular resumo do mês
  const currentMonthExpenses = transactions.reduce((sum, t) => sum + t.amount, 0)
  const transactionCount = transactions.length
  
  // Calcular total orçado das categorias
  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.allocated_amount, 0)
  const budgetUsagePercentage = totalBudgeted > 0 ? (currentMonthExpenses / totalBudgeted) * 100 : 0

  // Categorias mais frequentes (ordenar por frequência de uso - mock para agora)
  const frequentCategories = categories
    .filter(cat => cat.is_active)
    .sort((a, b) => (b.allocated_amount - b.current_balance) - (a.allocated_amount - a.current_balance))
    .slice(0, 3)

  const handleRegisterExpense = async (data: CreateExpenseRequest) => {
    try {
      await createExpense(data)
      // Recarregar dados se necessário
      window.location.reload() // Simplificado - em produção usar refetch dos hooks
    } catch (error) {
      console.error('Erro ao registrar despesa:', error)
      throw error
    }
  }

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1DD1A1] to-[#00A085] flex items-center justify-center">
        <div className="text-white text-lg">Carregando categorias...</div>
      </div>
    )
  }

  if (categoriesError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1DD1A1] to-[#00A085] flex items-center justify-center p-6">
        <Card className="p-6 text-center max-w-md">
          <h2 className="text-lg font-bold text-red-600 mb-2">Erro ao Carregar</h2>
          <p className="text-gray-600 mb-4">{categoriesError}</p>
          <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1DD1A1] to-[#00A085] pb-20">
      {/* Header */}
      <div className="p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Registrar Despesa</h1>
              <p className="text-white/90">Acompanhe seus gastos com precisão</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#F0F4F3] rounded-t-3xl min-h-[calc(100vh-120px)] p-6">
        {/* Resumo do Mês */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingDown className="w-5 h-5 text-[#1DD1A1]" />
            <h2 className="text-lg font-bold text-[#2C3E50]">Resumo do Mês</h2>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#2C3E50]">
                {formatCurrency(currentMonthExpenses).replace('R$', 'R$').replace(',00', '')}
              </p>
              <p className="text-sm text-[#7F8C8D]">Gasto Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#2C3E50]">{transactionCount}</p>
              <p className="text-sm text-[#7F8C8D]">Transações</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#1DD1A1]">{budgetUsagePercentage.toFixed(0)}%</p>
              <p className="text-sm text-[#7F8C8D]">do Orçamento</p>
            </div>
          </div>
        </div>

        {/* Categorias Frequentes */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-xl">⚡</span>
            <h2 className="text-lg font-bold text-[#2C3E50]">Categorias Frequentes</h2>
          </div>

          <div className="space-y-3">
            {frequentCategories.map((category) => {
              const used = category.allocated_amount - category.current_balance
              const usagePercent = (used / category.allocated_amount) * 100

              return (
                <Card key={category.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <div>
                        <h3 className="font-semibold text-[#2C3E50]">{category.name}</h3>
                        <p className="text-sm text-[#7F8C8D]">
                          {formatCurrency(category.current_balance)} disponível
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#1DD1A1]">
                        {formatCurrency(used)}
                      </p>
                      <p className="text-sm text-[#7F8C8D]">{usagePercent.toFixed(0)}% usado</p>
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(usagePercent, 100)}%`,
                        backgroundColor: category.color
                      }}
                    />
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Nova Despesa */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-xl">✅</span>
            <h2 className="text-lg font-bold text-[#2C3E50]">Nova Despesa</h2>
          </div>

          <Button
            onClick={() => setShowModal(true)}
            className="w-full bg-[#1DD1A1] text-white py-4 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Registrar Despesa
          </Button>
        </div>

        {/* Lista de Categorias */}
        {categories.length > 0 && (
          <div>
            <h3 className="text-md font-semibold text-[#2C3E50] mb-3">Todas as Categorias</h3>
            <div className="grid grid-cols-2 gap-3">
              {categories.filter(cat => cat.is_active).map((category) => (
                <div
                  key={category.id}
                  className="p-3 bg-white rounded-xl border border-gray-100 text-center"
                >
                  <div 
                    className="w-8 h-8 rounded-full mx-auto mb-2" 
                    style={{ backgroundColor: category.color }}
                  />
                  <p className="font-medium text-[#2C3E50] text-sm">{category.name}</p>
                  <p className="text-xs text-[#7F8C8D]">
                    {formatCurrency(category.current_balance)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />

      {/* Modal */}
      {showModal && (
        <RegisterExpenseModal
          categories={categories.filter(cat => cat.is_active)}
          onClose={() => setShowModal(false)}
          onSubmit={handleRegisterExpense}
        />
      )}
    </div>
  )
}