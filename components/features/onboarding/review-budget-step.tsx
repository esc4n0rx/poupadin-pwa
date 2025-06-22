"use client"

import { Button } from "@/components/ui/button"
import { StepHeader } from "./step-header"
import type { Income, BudgetCategory } from "@/types/budget"

interface ReviewBudgetStepProps {
  incomes: Income[]
  categories: BudgetCategory[]
  totalIncome: number
  totalAllocated: number
  onBack: () => void
  onFinish: () => void
  loading?: boolean
}

export function ReviewBudgetStep({
  incomes,
  categories,
  totalIncome,
  totalAllocated,
  onBack,
  onFinish,
  loading = false,
}: ReviewBudgetStepProps) {
  const remaining = totalIncome - totalAllocated

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1DD1A1] to-[#00A085]">
      <StepHeader
        title="Revisar Orçamento"
        subtitle="Revise todas as informações antes de finalizar"
        currentStep={3}
        totalSteps={3}
        onBack={onBack}
      />

      <div className="bg-[#F0F4F3] rounded-t-3xl min-h-[calc(100vh-200px)] p-6 pt-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#2C3E50] mb-4">Categorias</h2>

          <div className="space-y-3 mb-8">
            {categories.map((category) => (
              <div key={category.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="font-medium text-[#2C3E50]">{category.name}</span>
                  </div>
                  <span className="font-bold text-[#1DD1A1]">
                    R$ {category.allocated_amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo Financeiro */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center py-2">
              <span className="text-[#2C3E50] font-medium">Total de Renda:</span>
              <span className="text-[#1DD1A1] font-bold text-lg">
                R$ {totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-[#2C3E50] font-medium">Total Alocado:</span>
              <span className="text-[#1DD1A1] font-bold text-lg">
                R$ {totalAllocated.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between items-center py-2">
                <span className="text-[#2C3E50] font-bold">Restante:</span>
                <span className="text-[#1DD1A1] font-bold text-xl">
                  R$ {remaining.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-6 left-6 right-6 flex space-x-4">
          <Button variant="outline" onClick={onBack} className="flex-1 border-[#1DD1A1] text-[#1DD1A1]" disabled={loading}>
            Voltar
          </Button>
          <Button onClick={onFinish} className="flex-1 bg-[#1DD1A1] text-white" loading={loading}>
            Finalizar Setup
          </Button>
        </div>
      </div>
    </div>
  )
}