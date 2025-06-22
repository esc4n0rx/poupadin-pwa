"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { BudgetCategory } from "./budget-onboarding"

interface AddCategoryModalProps {
  onClose: () => void
  onAdd: (category: Omit<BudgetCategory, "id">) => void
  availableAmount: number
}

const categoryColors = [
  "#EF4444", // Red
  "#F97316", // Orange
  "#EAB308", // Yellow
  "#22C55E", // Green
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#6B7280", // Gray
]

export function AddCategoryModal({ onClose, onAdd, availableAmount }: AddCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    color: categoryColors[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number.parseFloat(formData.amount)

    if (formData.name && formData.amount && amount <= availableAmount) {
      onAdd({
        name: formData.name,
        amount: amount,
        color: formData.color,
      })
      onClose()
    }
  }

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const maxAmount = Math.max(0, availableAmount)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl w-full max-w-md p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#2C3E50]">Adicionar Categoria</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-[#7F8C8D]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              label="Nome da Categoria"
              value={formData.name}
              onChange={handleChange("name")}
              placeholder="Ex: Alimentação, Transporte, Casa..."
              required
            />
          </div>

          <div>
            <Input
              label="Valor Orçado"
              type="number"
              step="0.01"
              max={maxAmount}
              value={formData.amount}
              onChange={handleChange("amount")}
              placeholder="0,00"
              required
            />
            <p className="text-sm text-[#7F8C8D] mt-1">
              Disponível: R$ {availableAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-3">Cor da Categoria</label>
            <div className="flex space-x-3">
              {categoryColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color ? "border-[#1DD1A1] scale-110" : "border-gray-300"
                  } transition-all`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
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
