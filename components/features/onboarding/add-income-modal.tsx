"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Income } from "./budget-onboarding"

interface AddIncomeModalProps {
  onClose: () => void
  onAdd: (income: Omit<Income, "id">) => void
}

export function AddIncomeModal({ onClose, onAdd }: AddIncomeModalProps) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    receive_day: "1",
  })

  const [errors, setErrors] = useState({
    description: "",
    amount: "",
    receive_day: "",
  })

  const validateForm = () => {
    const newErrors = {
      description: "",
      amount: "",
      receive_day: "",
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória"
    } else if (formData.description.trim().length < 3) {
      newErrors.description = "Descrição deve ter pelo menos 3 caracteres"
    }

    if (!formData.amount) {
      newErrors.amount = "Valor é obrigatório"
    } else if (Number(formData.amount) <= 0) {
      newErrors.amount = "Valor deve ser positivo"
    }

    const receiveDay = Number(formData.receive_day)
    if (!formData.receive_day) {
      newErrors.receive_day = "Dia de recebimento é obrigatório"
    } else if (receiveDay < 1 || receiveDay > 31) {
      newErrors.receive_day = "Dia deve estar entre 1 e 31"
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error !== "")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    onAdd({
      description: formData.description.trim(),
      amount: Number(formData.amount),
      receive_day: Number(formData.receive_day),
    })
    onClose()
  }

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl w-full max-w-md p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#2C3E50]">Adicionar Renda</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-[#7F8C8D]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              label="Descrição da Renda"
              value={formData.description}
              onChange={handleChange("description")}
              placeholder="Ex: Salário, Freelance, Aluguel..."
              error={errors.description}
              required
            />
          </div>

          <div>
            <Input
              label="Valor"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={handleChange("amount")}
              placeholder="0,00"
              error={errors.amount}
              required
            />
          </div>

          <div>
            <Input
              label="Dia do Recebimento"
              type="number"
              min="1"
              max="31"
              value={formData.receive_day}
              onChange={handleChange("receive_day")}
              error={errors.receive_day}
              required
            />
            <p className="text-sm text-[#7F8C8D] mt-1">
              Dia do mês em que você recebe essa renda (1-31)
            </p>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Adicionar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}