"use client"

import { useFinance } from "@/context/finance-context"
import { Receipt, Wallet, CreditCard, Banknote, ArrowUpRight } from "lucide-react"

interface RecordListProps {
  date: Date
}

const categoryIcons: Record<string, any> = {
  Comida: Receipt,
  Roupas: Wallet,
  Transporte: CreditCard,
  Salário: Banknote,
}

const paymentMethodIcons: Record<string, any> = {
  Cartão: CreditCard,
  Pix: ArrowUpRight,
  Dinheiro: Banknote,
  Conta: Wallet,
}

export function RecordList({ date }: RecordListProps) {
  const { records } = useFinance()

  const dateString = date.toLocaleDateString("pt-BR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  })

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 mb-4 text-muted-foreground">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="6" width="18" height="14" rx="2" />
            <path d="M3 10h18" />
            <circle cx="12" cy="15" r="1" />
          </svg>
        </div>
        <p className="text-muted-foreground mb-1">Nenhum registro hoje</p>
        <p className="text-sm text-muted-foreground">Toque em + para adicionar nova despesa ou receita</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground capitalize">{dateString}</h3>

      <div className="space-y-3">
        {records.map((record) => {
          const Icon = categoryIcons[record.categoria] || Receipt
          const PaymentIcon = paymentMethodIcons[record.metodo] || Wallet
          const isExpense = record.tipo === "Despesa"

          return (
            <div
              key={record.id}
              className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border hover:shadow-sm transition-shadow"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isExpense ? "bg-red-100" : "bg-green-100"
                }`}
              >
                <Icon className={`w-6 h-6 ${isExpense ? "text-red-600" : "text-green-600"}`} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{record.categoria}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <PaymentIcon className="w-3 h-3" />
                  <span>{record.metodo}</span>
                </div>
              </div>

              <div className="text-right">
                <p className={`font-bold text-lg ${isExpense ? "text-red-600" : "text-green-600"}`}>
                  {isExpense ? "-" : "+"}R${Math.abs(record.valor).toFixed(2)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
