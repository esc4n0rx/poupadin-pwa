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
    paymentDay: "1",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.description && formData.amount) {
      onAdd({
        description: formData.description,
        amount: Number.parseFloat(formData.amount),
        paymentDay: Number.parseInt(formData.paymentDay),
      })
      onClose()
    }
  }

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
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
              required
            />
          </div>

          <div>
            <Input
              label="Valor"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={handleChange("amount")}
              placeholder="0,00"
              required
            />
          </div>

          <div>
            <Input
              label="Dia do Recebimento"
              type="number"
              min="1"
              max="31"
              value={formData.paymentDay}
              onChange={handleChange("paymentDay")}
              required
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
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
