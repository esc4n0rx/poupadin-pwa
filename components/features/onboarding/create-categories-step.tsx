"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StepHeader } from "./step-header"
import { AddCategoryModal } from "./add-category-modal"
import type { BudgetCategory } from "./budget-onboarding"

interface CreateCategoriesStepProps {
  categories: BudgetCategory[]
  totalIncome: number
  totalAllocated: number
  onAddCategory: (category: Omit<BudgetCategory, "id">) => void
  onNext: () => void
  onBack: () => void
  canProceed: boolean
}

export function CreateCategoriesStep({
  categories,
  totalIncome,
  totalAllocated,
  onAddCategory,
  onNext,
  onBack,
  canProceed,
}: CreateCategoriesStepProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const availableToAllocate = totalIncome - totalAllocated

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1DD1A1] to-[#00A085]">
      <StepHeader
        title="Criar Categorias"
        subtitle="Agora vamos criar suas categorias de gastos"
        currentStep={2}
        totalSteps={3}
        onBack={onBack}
      />

      <div className="bg-[#F0F4F3] rounded-t-3xl min-h-[calc(100vh-200px)] p-6 pt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-2 flex items-center">Categorias de Gastos 📊</h2>
          <p className="text-[#7F8C8D] mb-4">Distribua sua renda em diferentes categorias.</p>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-[#2C3E50] font-medium">Total Alocado:</span>
              <span className="text-[#1DD1A1] font-bold">
                R$ {totalAllocated.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#2C3E50] font-medium">Disponível para Alocar:</span>
              <span className="text-[#1DD1A1] font-bold">
                R$ {availableToAllocate.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {categories.length === 0 ? (
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full p-6 bg-[#E8F8F5] border-2 border-dashed border-[#1DD1A1] rounded-2xl flex items-center justify-center space-x-3 text-[#1DD1A1] hover:bg-[#E8F8F5]/80 transition-colors"
          >
            <Plus className="w-6 h-6" />
            <span className="font-medium text-lg">Adicionar Categoria</span>
          </button>
        ) : (
          <div className="space-y-4 mb-20">
            {categories.map((category) => (
              <div key={category.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                    <h3 className="font-semibold text-[#2C3E50]">{category.name}</h3>
                  </div>
                  <p className="text-xl font-bold text-[#1DD1A1]">
                    R$ {category.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))}

            <button
              onClick={() => setShowAddModal(true)}
              className="w-full p-4 bg-[#E8F8F5] border border-[#1DD1A1] rounded-2xl flex items-center justify-center space-x-2 text-[#1DD1A1] hover:bg-[#E8F8F5]/80 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Adicionar Categoria</span>
            </button>
          </div>
        )}

        <div className="fixed bottom-6 left-6 right-6 flex space-x-4">
          <Button variant="outline" onClick={onBack} className="flex-1 border-[#1DD1A1] text-[#1DD1A1]">
            Voltar
          </Button>
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="flex-1 bg-gray-400 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
            style={canProceed ? { backgroundColor: "#1DD1A1" } : {}}
          >
            Próximo
          </Button>
        </div>
      </div>

      {showAddModal && (
        <AddCategoryModal
          onClose={() => setShowAddModal(false)}
          onAdd={onAddCategory}
          availableAmount={availableToAllocate}
        />
      )}
    </div>
  )
}
