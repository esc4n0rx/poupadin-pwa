"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Record {
  id: number
  categoria: string
  tipo: "Despesa" | "Receita"
  valor: number
  metodo: string
}

interface FinanceContextType {
  records: Record[]
  addRecord: (record: Omit<Record, "id">) => void
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

const mockRecords: Record[] = [
  { id: 1, categoria: "Comida", tipo: "Despesa", valor: -45.0, metodo: "Cartão" },
  { id: 2, categoria: "Roupas", tipo: "Despesa", valor: -120.0, metodo: "Pix" },
  { id: 3, categoria: "Salário", tipo: "Receita", valor: 3500.0, metodo: "Conta" },
  { id: 4, categoria: "Transporte", tipo: "Despesa", valor: -30.0, metodo: "Dinheiro" },
]

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<Record[]>(mockRecords)

  const addRecord = (record: Omit<Record, "id">) => {
    const newRecord = {
      ...record,
      id: Math.max(...records.map((r) => r.id), 0) + 1,
    }
    setRecords([...records, newRecord])
  }

  return <FinanceContext.Provider value={{ records, addRecord }}>{children}</FinanceContext.Provider>
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider")
  }
  return context
}
