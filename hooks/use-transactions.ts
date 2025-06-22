// hooks/use-transactions.ts
"use client"

import { useState, useEffect } from 'react'
import { TransactionsApi } from '@/lib/transactions-api'
import { Transaction, TransactionFilters } from '@/types/transactions'

export function useTransactions(filters: TransactionFilters = {}) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await TransactionsApi.getTransactions(filters)
      setTransactions(response.transactions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar transações')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [JSON.stringify(filters)])

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions
  }
}