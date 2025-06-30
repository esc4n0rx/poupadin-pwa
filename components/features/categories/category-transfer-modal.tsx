"use client"

import React, { useState } from 'react'
import { X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BudgetCategory } from '@/types/expense'
import { CategoryTransferRequest } from '@/types/categories'
import { formatCurrency } from '@/lib/utils'

interface CategoryTransferModalProps {
  categories: BudgetCategory[]
  onClose: () => void
  onTransfer: (data: CategoryTransferRequest) => Promise<void>
}

export function CategoryTransferModal({ categories, onClose, onTransfer }: CategoryTransferModalProps) {
  const [formData, setFormData] = useState({
    from_category_id: '',
    to_category_id: '',
    amount: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fromCategory = categories.find(cat => cat.id === formData.from_category_id)
  const toCategory = categories.find(cat => cat.id === formData.to_category_id)
  const transferAmount = parseFloat(formData.amount) || 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validações
    if (!formData.from_category_id) {
      setError('Selecione a categoria de origem')
      return
    }

    if (!formData.to_category_id) {
      setError('Selecione a categoria de destino')
      return
    }

    if (formData.from_category_id === formData.to_category_id) {
      setError('As categorias de origem e destino devem ser diferentes')
      return
    }

    if (!transferAmount || transferAmount <= 0) {
      setError('Valor deve ser maior que zero')
      return
    }

    if (fromCategory && transferAmount > fromCategory.current_balance) {
      setError('Valor excede o saldo disponível da categoria de origem')
      return
    }

    if (!formData.description.trim() || formData.description.trim().length < 3) {
      setError('Descrição deve ter pelo menos 3 caracteres')
      return
    }

    setLoading(true)
    try {
      await onTransfer({
        from_category_id: formData.from_category_id,
        to_category_id: formData.to_category_id,
        amount: transferAmount,
        description: formData.description.trim()
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao transferir valor')
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
          <h2 className="text-xl font-bold text-[#2C3E50]">Transferir entre Categorias</h2>
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
            <label className="block text-sm font-medium text-[#2C3E50] mb-2">De (Origem)</label>
            <select
              value={formData.from_category_id}
              onChange={handleChange('from_category_id')}
              className="w-full px-4 py-3 bg-[#E8F8F5] border border-transparent rounded-2xl text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#1DD1A1] focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Selecione a categoria de origem</option>
              {categories.filter(cat => cat.current_balance > 0).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} - {formatCurrency(category.current_balance)} disponível
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-2">Para (Destino)</label>
            <select
              value={formData.to_category_id}
              onChange={handleChange('to_category_id')}
              className="w-full px-4 py-3 bg-[#E8F8F5] border border-transparent rounded-2xl text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#1DD1A1] focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Selecione a categoria de destino</option>
              {categories.filter(cat => cat.id !== formData.from_category_id).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {fromCategory && toCategory && (
            <div className="p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: fromCategory.color }}
                  />
                  <div>
                    <p className="font-medium text-[#2C3E50] text-sm">{fromCategory.name}</p>
                    <p className="text-xs text-[#7F8C8D]">{formatCurrency(fromCategory.current_balance)}</p>
                  </div>
                </div>
                
                <ArrowRight className="w-5 h-5 text-[#7F8C8D]" />
                
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: toCategory.color }}
                  />
                  <div>
                    <p className="font-medium text-[#2C3E50] text-sm">{toCategory.name}</p>
                    <p className="text-xs text-[#7F8C8D]">{formatCurrency(toCategory.current_balance)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <Input
              label="Valor da Transferência (R$)"
              type="number"
              step="0.01"
              min="0.01"
              max={fromCategory?.current_balance}
              value={formData.amount}
              onChange={handleChange('amount')}
              placeholder="0,00"
              required
            />
            {fromCategory && transferAmount > fromCategory.current_balance && (
              <p className="text-sm text-red-500 mt-1">
                Valor excede o saldo disponível: {formatCurrency(fromCategory.current_balance)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-2">Descrição</label>
            <textarea
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Ex: Remanejamento para objetivo específico"
              className="w-full px-4 py-3 bg-[#E8F8F5] border border-transparent rounded-2xl text-[#2C3E50] placeholder-[#7F8C8D] focus:outline-none focus:ring-2 focus:ring-[#1DD1A1] focus:border-transparent transition-all duration-200 resize-none"
              rows={3}
              maxLength={200}
              required
            />
            <p className="text-xs text-[#7F8C8D] mt-1">
              {formData.description.length}/200 caracteres (mín: 3)
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
              Transferir
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}