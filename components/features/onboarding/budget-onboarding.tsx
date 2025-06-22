"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DefineIncomeStep } from "./define-income-step"
import { CreateCategoriesStep } from "./create-categories-step"
import { ReviewBudgetStep } from "./review-budget-step"
import { useBudget } from "@/contexts/budget-context"

export interface Income {
  id: string
  description: string
  amount: number
  paymentDay: number
}

export interface BudgetCategory {
  id: string
  name: string
  amount: number
  color: string
}

export function BudgetOnboarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const [incomes, setIncomes] = useState<Income[]>([])
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([])
  const { completeBudgetSetup } = useBudget()
  const router = useRouter()

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)
  const totalAllocated = budgetCategories.reduce((sum, category) => sum + category.amount, 0)

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

  const handleFinishSetup = () => {
    completeBudgetSetup(incomes, budgetCategories)
    router.push("/dashboard")
  }

  const canProceedFromStep1 = incomes.length > 0
  const canProceedFromStep2 = budgetCategories.length > 0

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
        />
      )
    default:
      return null
  }
}
