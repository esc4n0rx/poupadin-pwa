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
      setError(err instanceof Error ? err.message : 'Erro ao realizar transferência')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (error) setError('')
  }

  // Filtrar categorias para evitar duplicação nas opções
  const fromOptions = categories.filter(cat => cat.is_active && cat.current_balance > 0)
  const toOptions = categories.filter(cat => cat.is_active && cat.id !== formData.from_category_id)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl w-full max-w-md p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
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

          {/* Categoria de Origem */}
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-2">De (Origem)</label>
            <select
              value={formData.from_category_id}
              onChange={handleChange('from_category_id')}
              className="w-full px-4 py-3 bg-[#E8F8F5] border border-transparent rounded-2xl text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#1DD1A1] focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Selecione a categoria de origem</option>
              {fromOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} - {formatCurrency(category.current_balance)} disponível
                </option>
              ))}
            </select>
          </div>

          {/* Seta Visual */}
          {fromCategory && (
            <div className="flex justify-center">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: fromCategory.color }}
                  />
                  <span className="text-sm font-medium text-[#2C3E50]">{fromCategory.name}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-[#1DD1A1]" />
                <div className="flex items-center space-x-2">
                  {toCategory && (
                    <>
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: toCategory.color }}
                      />
                      <span className="text-sm font-medium text-[#2C3E50]">{toCategory.name}</span>
                    </>
                  )}
                  {!toCategory && <span className="text-sm text-[#7F8C8D]">Selecione destino</span>}
                </div>
              </div>
            </div>
          )}

          {/* Categoria de Destino */}
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-2">Para (Destino)</label>
            <select
              value={formData.to_category_id}
              onChange={handleChange('to_category_id')}
              className="w-full px-4 py-3 bg-[#E8F8F5] border border-transparent rounded-2xl text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#1DD1A1] focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Selecione a categoria de destino</option>
              {toOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} - {formatCurrency(category.current_balance)} atual
                </option>
              ))}
            </select>
          </div>

          {/* Valor da Transferência */}
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
            {fromCategory && (
              <p className="text-sm text-[#7F8C8D] mt-1">
                Máximo disponível: {formatCurrency(fromCategory.current_balance)}
              </p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-2">Descrição</label>
            <textarea
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Ex: Remanejamento para objetivo específico"
              className="w-full px-4 py-3 bg-[#E8F8F5] border border-transparent rounded-2xl text-[#2C3E50] placeholder-[#7F8C8D] focus:outline-none focus:ring-2 focus:ring-[#1DD1A1] focus:border-transparent transition-all duration-200 resize-none"
              rows={3}
              minLength={3}
              maxLength={200}
              required
            />
            <p className="text-xs text-[#7F8C8D] mt-1">
              {formData.description.length}/200 caracteres (mín: 3)
            </p>
          </div>

          {/* Preview da Transferência */}
          {fromCategory && toCategory && transferAmount > 0 && (
            <div className="p-4 bg-blue-50 rounded-2xl">
              <h4 className="font-medium text-[#2C3E50] mb-3">Preview da Transferência:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#7F8C8D]">{fromCategory.name} (atual):</span>
                  <span className="font-medium text-[#2C3E50]">{formatCurrency(fromCategory.current_balance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7F8C8D]">{fromCategory.name} (depois):</span>
                  <span className="font-medium text-red-600">{formatCurrency(fromCategory.current_balance - transferAmount)}</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between">
                  <span className="text-[#7F8C8D]">{toCategory.name} (atual):</span>
                  <span className="font-medium text-[#2C3E50]">{formatCurrency(toCategory.current_balance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7F8C8D]">{toCategory.name} (depois):</span>
                  <span className="font-medium text-green-600">{formatCurrency(toCategory.current_balance + transferAmount)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4 pt-4">
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
              Transferir {transferAmount > 0 && `${formatCurrency(transferAmount)}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}