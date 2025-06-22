"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DefineIncomeStep } from "./define-income-step"
import { CreateCategoriesStep } from "./create-categories-step"
import { ReviewBudgetStep } from "./review-budget-step"
import { useAuth } from "@/contexts/auth-context"
import { BudgetApi } from "@/lib/budget-api"
import { Income, BudgetCategory } from "@/types/budget"

export { type Income, type BudgetCategory }

export function BudgetOnboarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const [incomes, setIncomes] = useState<Income[]>([])
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { updateUser } = useAuth()
  const router = useRouter()

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)
  const totalAllocated = budgetCategories.reduce((sum, category) => sum + category.allocated_amount, 0)

  const handleAddIncome = (income: Omit<Income, "id">) => {
    const newIncome: Income = {
      ...income,
      id: Date.now().toString(),
    }
    setIncomes((prev) => [...prev, newIncome])
  }

  const handleAddCategory = (category: Omit<BudgetCategory, "id">) => {
    const newCategory: BudgetCategory = {
      ...category,
      id: Date.now().toString(),
    }
    setBudgetCategories((prev) => [...prev, newCategory])
  }

  const validateData = () => {
    // Validar incomes
    for (const income of incomes) {
      if (!income.description || income.description.trim().length < 3) {
        throw new Error("Descrição da renda deve ter pelo menos 3 caracteres")
      }
      if (!income.amount || income.amount <= 0) {
        throw new Error("Valor da renda deve ser positivo")
      }
      if (!income.receive_day || income.receive_day < 1 || income.receive_day > 31) {
        throw new Error("Dia de recebimento deve estar entre 1 e 31")
      }
    }

    // Validar categorias
    for (const category of budgetCategories) {
      if (!category.name || category.name.trim().length < 2) {
        throw new Error("Nome da categoria deve ter pelo menos 2 caracteres")
      }
      if (category.allocated_amount < 0) {
        throw new Error("Valor alocado deve ser positivo ou zero")
      }
    }

    if (incomes.length === 0) {
      throw new Error("Pelo menos uma renda deve ser adicionada")
    }

    if (budgetCategories.length === 0) {
      throw new Error("Pelo menos uma categoria deve ser adicionada")
    }
  }

  const handleFinishSetup = async () => {
    setLoading(true)
    setError("")

    try {
      // Validar dados antes de enviar
      validateData()

      // Preparar dados exatamente como a API espera
      const budgetData = {
        incomes: incomes.map(income => ({
          description: income.description.trim(),
          amount: Number(income.amount),
          receive_day: Number(income.receive_day)
        })),
        categories: budgetCategories.map(category => ({
          name: category.name.trim(),
          allocated_amount: Number(category.allocated_amount),
          color: category.color
        }))
      }

      console.log("Dados sendo enviados para a API:", budgetData)

      // Enviar para o backend
      const response = await BudgetApi.createInitialBudget(budgetData)
      
      console.log("Resposta da API:", response)

      // Atualizar o status do usuário
      updateUser({ initial_setup_completed: true })

      // Redirecionar para o dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Erro ao criar orçamento:", error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Erro inesperado ao finalizar setup")
      }
    } finally {
      setLoading(false)
    }
  }

  const canProceedFromStep1 = incomes.length > 0
  const canProceedFromStep2 = budgetCategories.length > 0

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1DD1A1] to-[#00A085] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Erro</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => setError("")}
            className="w-full bg-[#1DD1A1] text-white py-3 rounded-2xl font-medium"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  switch (currentStep) {
    case 1:
      return (
        <DefineIncomeStep
          incomes={incomes}
          onAddIncome={handleAddIncome}
          onNext={() => setCurrentStep(2)}
          canProceed={canProceedFromStep1}
        />
      )
    case 2:
      return (
        <CreateCategoriesStep
          categories={budgetCategories}
          totalIncome={totalIncome}
          totalAllocated={totalAllocated}
          onAddCategory={handleAddCategory}
          onNext={() => setCurrentStep(3)}
          onBack={() => setCurrentStep(1)}
          canProceed={canProceedFromStep2}
        />
      )
    case 3:
      return (
        <ReviewBudgetStep
          incomes={incomes}
          categories={budgetCategories}
          totalIncome={totalIncome}
          totalAllocated={totalAllocated}
          onBack={() => setCurrentStep(2)}
          onFinish={handleFinishSetup}
          loading={loading}
        />
      )
    default:
      return null
  }
}