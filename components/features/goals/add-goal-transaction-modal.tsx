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
    <div className="modal-container">
      <div className="modal-content-with-nav">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#2C3E50]">
            {transactionType === 'deposit' ? 'Depositar no Objetivo' : 'Retirar do Objetivo'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-[#7F8C8D]" />
          </button>
        </div>

        {/* Goal Summary */}
        <div className="p-4 bg-gray-50 rounded-2xl mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: goal.color }}
            />
            <h3 className="font-medium text-[#2C3E50]">{goal.name}</h3>
          </div>
          <div className="text-sm text-[#7F8C8D]">
            <p>Valor atual: {formatCurrency(goal.current_amount)}</p>
            <p>Meta: {formatCurrency(goal.target_amount)}</p>
            <p>Restante: {formatCurrency(remainingToTarget)}</p>
          </div>
        </div>

        {/* Transaction Type Toggle */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-2xl p-1">
          <button
            type="button"
            onClick={() => setTransactionType('deposit')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2 ${
              transactionType === 'deposit'
                ? 'bg-white text-[#1DD1A1] shadow-sm'
                : 'text-[#7F8C8D]'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Depositar</span>
          </button>
          <button
            type="button"
            onClick={() => setTransactionType('withdrawal')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2 ${
              transactionType === 'withdrawal'
                ? 'bg-white text-[#E74C3C] shadow-sm'
                : 'text-[#7F8C8D]'
            }`}
          >
            <Minus className="w-4 h-4" />
            <span>Retirar</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div>
            <Input
              label={`Valor a ${transactionType === 'deposit' ? 'Depositar' : 'Retirar'} (R$)`}
              type="number"
              step="0.01"
              min="0.01"
              max={transactionType === 'withdrawal' ? goal.current_amount : undefined}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              required
            />
            {transactionType === 'deposit' && parseFloat(amount) > remainingToTarget && (
              <p className="text-sm text-amber-600 mt-1">
                ⚠️ Valor excede o restante para a meta: {formatCurrency(remainingToTarget)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-2">Descrição (opcional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Ex: ${transactionType === 'deposit' ? 'Economia do mês' : 'Necessidade específica'}`}
              className="w-full px-4 py-3 bg-[#E8F8F5] border border-transparent rounded-2xl text-[#2C3E50] placeholder-[#7F8C8D] focus:outline-none focus:ring-2 focus:ring-[#1DD1A1] focus:border-transparent transition-all duration-200 resize-none"
              rows={2}
              maxLength={200}
            />
          </div>

          {/* Preview */}
          {parseFloat(amount) > 0 && (
            <div className="p-4 bg-blue-50 rounded-2xl">
              <h4 className="font-medium text-blue-900 mb-2">Previsão após transação</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>Novo valor: {formatCurrency(newAmount)}</p>
                <p>Progresso: {newProgress.toFixed(1)}%</p>
                {transactionType === 'deposit' && newAmount >= goal.target_amount && (
                  <p className="text-green-600 font-medium">🎉 Meta atingida!</p>
                )}
              </div>
            </div>
          )}

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
              {transactionType === 'deposit' ? 'Depositar' : 'Retirar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}