"use client"

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BudgetCategory, CreateExpenseRequest } from '@/types/expense'
import { formatCurrency } from '@/lib/utils'

interface RegisterExpenseModalProps {
  categories: BudgetCategory[]
  onClose: () => void
  onSubmit: (data: CreateExpenseRequest) => Promise<void>
}

export function RegisterExpenseModal({ categories, onClose, onSubmit }: RegisterExpenseModalProps) {
  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedCategory = categories.find(cat => cat.id === formData.category_id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.category_id) {
      setError('Selecione uma categoria')
      return
    }

    const amount = parseFloat(formData.amount)
    if (!amount || amount <= 0) {
      setError('Valor deve ser maior que zero')
      return
    }

    if (!formData.description.trim()) {
      setError('Descrição é obrigatória')
      return
    }

    if (selectedCategory && amount > selectedCategory.current_balance) {
      setError('Valor excede o saldo disponível da categoria')
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        category_id: formData.category_id,
        amount: amount,
        description: formData.description.trim()
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar despesa')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (error) setError('')
  }

  return (
    <div className="modal-container">
      <div className="modal-content-with-nav">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#2C3E50]">Nova Despesa</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-[#7F8C8D]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-2">Categoria</label>
            <select
              value={formData.category_id}
              onChange={handleChange('category_id')}
              className="w-full px-4 py-3 bg-[#E8F8F5] border border-transparent rounded-2xl text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#1DD1A1] focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} - {formatCurrency(category.current_balance)} disponível
                </option>
              ))}
            </select>
          </div>

          {selectedCategory && (
            <div className="p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: selectedCategory.color }}
                  />
                  <span className="font-medium text-[#2C3E50]">{selectedCategory.name}</span>
                </div>
              </div>
              <div className="text-sm text-[#7F8C8D]">
                <p>Orçado: {formatCurrency(selectedCategory.allocated_amount)}</p>
                <p>Disponível: {formatCurrency(selectedCategory.current_balance)}</p>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(((selectedCategory.allocated_amount - selectedCategory.current_balance) / selectedCategory.allocated_amount) * 100, 100)}%`,
                      backgroundColor: selectedCategory.color
                    }}
                  />
                </div>
                <p className="text-xs text-[#7F8C8D] mt-1">
                  {(((selectedCategory.allocated_amount - selectedCategory.current_balance) / selectedCategory.allocated_amount) * 100).toFixed(1)}% usado
                </p>
              </div>
            </div>
          )}

          <div>
            <Input
              label="Valor da Despesa (R$)"
              type="number"
              step="0.01"
              min="0.01"
              max={selectedCategory?.current_balance}
              value={formData.amount}
              onChange={handleChange('amount')}
              placeholder="0,00"
              required
            />
            {selectedCategory && parseFloat(formData.amount) > selectedCategory.current_balance && (
              <p className="text-sm text-red-500 mt-1">
                Valor excede o saldo disponível: {formatCurrency(selectedCategory.current_balance)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-2">Descrição</label>
            <textarea
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Ex: Almoço, gasolina, etc."
              className="w-full px-4 py-3 bg-[#E8F8F5] border border-transparent rounded-2xl text-[#2C3E50] placeholder-[#7F8C8D] focus:outline-none focus:ring-2 focus:ring-[#1DD1A1] focus:border-transparent transition-all duration-200 resize-none"
              rows={3}
              maxLength={200}
              required
            />
            <p className="text-xs text-[#7F8C8D] mt-1">
              {formData.description.length}/200 caracteres
            </p>
          </div>

          <div className="modal-actions-sticky">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose} 
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              loading={loading}
            >
              Registrar Despesa
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}