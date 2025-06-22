"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StepHeader } from "./step-header"
import { AddIncomeModal } from "./add-income-modal"
import type { Income } from "./budget-onboarding"

interface DefineIncomeStepProps {
  incomes: Income[]
  onAddIncome: (income: Omit<Income, "id">) => void
  onNext: () => void
  canProceed: boolean
}

export function DefineIncomeStep({ incomes, onAddIncome, onNext, canProceed }: DefineIncomeStepProps) {
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1DD1A1] to-[#00A085]">
      <StepHeader
        title="Definir Rendas"
        subtitle="Vamos começar definindo suas fontes de renda"
        currentStep={1}
        totalSteps={3}
      />

      <div className="bg-[#F0F4F3] rounded-t-3xl min-h-[calc(100vh-200px)] p-6 pt-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-2 flex items-center">Suas Rendas 💰</h2>
          <p className="text-[#7F8C8D]">Adicione todas as suas fontes de renda mensais.</p>
        </div>

        {incomes.length === 0 ? (
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full p-6 bg-[#E8F8F5] border-2 border-dashed border-[#1DD1A1] rounded-2xl flex items-center justify-center space-x-3 text-[#1DD1A1] hover:bg-[#E8F8F5]/80 transition-colors"
          >
            <Plus className="w-6 h-6" />
            <span className="font-medium text-lg">Adicionar Renda</span>
          </button>
        ) : (
          <div className="space-y-4">
            {incomes.map((income) => (
              <div key={income.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-[#2C3E50]">{income.description}</h3>
                    <p className="text-sm text-[#7F8C8D]">Dia {income.paymentDay} do mês</p>
                  </div>
                  <p className="text-xl font-bold text-[#1DD1A1]">
                    R$ {income.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))}

            <button
              onClick={() => setShowAddModal(true)}
              className="w-full p-4 bg-[#E8F8F5] border border-[#1DD1A1] rounded-2xl flex items-center justify-center space-x-2 text-[#1DD1A1] hover:bg-[#E8F8F5]/80 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Adicionar Outra Renda</span>
            </button>
          </div>
        )}

        <div className="fixed bottom-6 left-6 right-6">
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="w-full bg-gray-400 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
            style={canProceed ? { backgroundColor: "#1DD1A1" } : {}}
          >
            Próximo
          </Button>
        </div>
      </div>

      {showAddModal && <AddIncomeModal onClose={() => setShowAddModal(false)} onAdd={onAddIncome} />}
    </div>
  )
}
