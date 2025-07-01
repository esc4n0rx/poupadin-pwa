"use client"

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CreateGoalRequest } from '@/types/goals'

interface AddGoalModalProps {
  onClose: () => void
  onAdd: (goal: CreateGoalRequest) => Promise<void>
}

const goalColors = [
  "#EF4444", // Red
  "#F97316", // Orange
  "#EAB308", // Yellow
  "#22C55E", // Green
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#6B7280", // Gray
]

export function AddGoalModal({ onClose, onAdd }: AddGoalModalProps) {
  const [formData, setFormData] = useState<CreateGoalRequest>({
    name: "",
    description: "",
    target_amount: 0,
    monthly_target: 0,
    target_date: "",
    color: goalColors[0],
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Nome deve ter pelo menos 3 caracteres"
    }

    if (!formData.target_amount || formData.target_amount <= 0) {
      newErrors.target_amount = "Valor meta deve ser positivo"
    }

    if (formData.monthly_target && formData.monthly_target < 0) {
      newErrors.monthly_target = "Meta mensal não pode ser negativa"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await onAdd({
        ...formData,
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
        monthly_target: formData.monthly_target || undefined,
        target_date: formData.target_date || undefined,
      })
      onClose()
    } catch (error) {
      console.error('Erro ao criar objetivo:', error)
      // Aqui você poderia definir um erro genérico para o formulário
      setErrors({ form: 'Ocorreu um erro ao criar o objetivo. Tente novamente.' });
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof CreateGoalRequest) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = field === 'target_amount' || field === 'monthly_target' 
      ? parseFloat(e.target.value) || 0 
      : e.target.value

    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-popup">
        <div className="modal-header">
          <h2 className="text-xl font-bold text-[#2C3E50]">Novo Objetivo</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-[#7F8C8D]" />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                label="Nome do Objetivo"
                value={formData.name}
                onChange={handleChange("name")}
                placeholder="Ex: Carro novo, Casa própria..."
                error={errors.name}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-2">Descrição (opcional)</label>
              <textarea
                value={formData.description}
                onChange={handleChange("description")}
                placeholder="Descreva seu objetivo..."
                className="w-full px-4 py-3 bg-[#E8F8F5] border border-transparent rounded-2xl text-[#2C3E50] placeholder-[#7F8C8D] focus:outline-none focus:ring-2 focus:ring-[#1DD1A1] focus:border-transparent transition-all duration-200 resize-none"
                rows={3}
              />
            </div>

            <div>
              <Input
                label="Valor Meta"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.target_amount}
                onChange={handleChange("target_amount")}
                placeholder="0,00"
                error={errors.target_amount}
                required
              />
            </div>

            <div>
              <Input
                label="Meta Mensal (opcional)"
                type="number"
                step="0.01"
                min="0"
                value={formData.monthly_target}
                onChange={handleChange("monthly_target")}
                placeholder="0,00"
                error={errors.monthly_target}
              />
            </div>

            <div>
              <Input
                label="Data Limite (opcional)"
                type="date"
                value={formData.target_date}
                onChange={handleChange("target_date")}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-3">Cor do Objetivo</label>
              <div className="flex flex-wrap gap-3">
                {goalColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color ? "border-[#1DD1A1] scale-110" : "border-gray-300"
                    } transition-all`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
             {errors.form && <p className="text-sm text-red-500 text-center">{errors.form}</p>}
          </form>
        </div>

        <div className="modal-footer">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1" disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit} className="flex-1" loading={loading}>
            Criar Objetivo
          </Button>
        </div>
      </div>
    </div>
  )
}