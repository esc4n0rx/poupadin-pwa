// components/features/goals/add-goal-transaction-modal.tsx
"use client"

import React, { useState } from 'react'
import { X, Plus, Minus, Wallet, TrendingDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Goal, GoalTransactionRequest } from '@/types/goals'
import { formatCurrency } from '@/lib/utils'

interface AddGoalTransactionModalProps {
  goal: Goal
  onClose: () => void
  onAddTransaction: (data: GoalTransactionRequest) => Promise<void>
}

export function AddGoalTransactionModal({ goal, onClose, onAddTransaction }: AddGoalTransactionModalProps) {
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdrawal'>('deposit')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const numAmount = parseFloat(amount)
    if (!numAmount || numAmount <= 0) {
      setError('Valor deve ser maior que zero')
      return
    }

    if (transactionType === 'withdrawal' && numAmount > goal.current_amount) {
      setError('Não é possível retirar mais do que o valor atual')
      return
    }

    setLoading(true)
    try {
      await onAddTransaction({
        goal_id: goal.id,
        transaction_type: transactionType,
        amount: numAmount,
        description: description.trim() || undefined
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar transação')
    } finally {
      setLoading(false)
    }
  }

  const remainingToTarget = goal.target_amount - goal.current_amount
  const newAmount = transactionType === 'deposit' 
    ? goal.current_amount + (parseFloat(amount) || 0)
    : goal.current_amount - (parseFloat(amount) || 0)

  const newProgress = Math.min((newAmount / goal.target_amount) * 100, 100)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl w-full max-w-md p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#2C3E50]">
            {transactionType === 'deposit' ? 'Adicionar Valor' : 'Retirar Valor'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-[#7F8C8D]" />
          </button>
        </div>

        {/* Informações do Objetivo */}
        <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
          <h3 className="font-semibold text-[#2C3E50] mb-2">{goal.name}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#7F8C8D]">Valor Atual</p>
              <p className="font-semibold text-[#2C3E50]">{formatCurrency(goal.current_amount)}</p>
            </div>
            <div>
              <p className="text-[#7F8C8D]">Falta Alcançar</p>
              <p className="font-semibold text-[#2C3E50]">{formatCurrency(remainingToTarget)}</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(goal.current_amount / goal.target_amount) * 100}%`,
                  backgroundColor: goal.color
                }}
              />
            </div>
            <p className="text-xs text-[#7F8C8D] mt-1">
              {((goal.current_amount / goal.target_amount) * 100).toFixed(1)}% concluído
            </p>
          </div>
        </div>

        {/* Tipo de Transação */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#2C3E50] mb-3">Tipo de Transação</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTransactionType('deposit')}
              className={`flex items-center justify-center space-x-2 p-3 rounded-xl border-2 transition-all ${
                transactionType === 'deposit'
                  ? 'border-[#1DD1A1] bg-[#E8F8F5] text-[#1DD1A1]'
                  : 'border-gray-200 bg-white text-[#7F8C8D]'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Adicionar</span>
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('withdrawal')}
              className={`flex items-center justify-center space-x-2 p-3 rounded-xl border-2 transition-all ${
                transactionType === 'withdrawal'
                  ? 'border-red-500 bg-red-50 text-red-500'
                  : 'border-gray-200 bg-white text-[#7F8C8D]'
              }`}
            >
              <Minus className="w-5 h-5" />
              <span className="font-medium">Retirar</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div>
            <Input
              label="Valor"
              type="number"
              step="0.01"
              min="0.01"
              max={transactionType === 'withdrawal' ? goal.current_amount : undefined}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              required
            />
            {transactionType === 'withdrawal' && (
              <p className="text-sm text-gray-600 mt-1">
                Máximo: {formatCurrency(goal.current_amount)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-2">
              Descrição (opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Ex: ${transactionType === 'deposit' ? 'Economia do mês' : 'Uso emergencial'}`}
              className="w-full px-4 py-3 bg-[#E8F8F5] border border-transparent rounded-2xl text-[#2C3E50] placeholder-[#7F8C8D] focus:outline-none focus:ring-2 focus:ring-[#1DD1A1] focus:border-transparent transition-all duration-200 resize-none"
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Preview do Resultado */}
          {amount && parseFloat(amount) > 0 && (
            <div className="p-4 bg-blue-50 rounded-2xl">
              <h4 className="font-medium text-[#2C3E50] mb-2">Preview:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#7F8C8D]">Novo valor atual:</span>
                  <span className="font-semibold text-[#2C3E50]">{formatCurrency(Math.max(0, newAmount))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7F8C8D]">Novo progresso:</span>
                  <span className="font-semibold text-[#2C3E50]">{newProgress.toFixed(1)}%</span>
                </div>
                {newAmount >= goal.target_amount && (
                  <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-2 rounded-lg mt-2">
                    <span className="text-lg">🎉</span>
                    <span className="font-medium">Objetivo será concluído!</span>
                  </div>
                )}
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
              style={{ 
                backgroundColor: transactionType === 'deposit' ? '#1DD1A1' : '#EF4444'
              }}
            >
              {transactionType === 'deposit' ? 'Adicionar' : 'Retirar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}