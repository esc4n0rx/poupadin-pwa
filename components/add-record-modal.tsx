"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFinance } from "@/context/finance-context"

interface AddRecordModalProps {
  open: boolean
  onClose: () => void
}

export function AddRecordModal({ open, onClose }: AddRecordModalProps) {
  const { addRecord } = useFinance()
  const [tipo, setTipo] = useState<"Despesa" | "Receita">("Despesa")
  const [categoria, setCategoria] = useState("")
  const [valor, setValor] = useState("")
  const [metodo, setMetodo] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    addRecord({
      categoria,
      tipo,
      valor: tipo === "Despesa" ? -Number.parseFloat(valor) : Number.parseFloat(valor),
      metodo,
    })

    // Reset form
    setCategoria("")
    setValor("")
    setMetodo("")
    onClose()
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Novo Registro</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={tipo === "Despesa" ? "default" : "outline"}
              className="flex-1 h-12 rounded-xl"
              onClick={() => setTipo("Despesa")}
            >
              Despesa
            </Button>
            <Button
              type="button"
              variant={tipo === "Receita" ? "default" : "outline"}
              className="flex-1 h-12 rounded-xl"
              onClick={() => setTipo("Receita")}
            >
              Receita
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria</Label>
            <Input
              id="categoria"
              placeholder="Ex: Comida, Transporte..."
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="h-12 rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">Valor (R$)</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="h-12 rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metodo">Método de Pagamento</Label>
            <Select value={metodo} onValueChange={setMetodo} required>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                <SelectItem value="Cartão">Cartão</SelectItem>
                <SelectItem value="Pix">Pix</SelectItem>
                <SelectItem value="Conta">Conta Bancária</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-base font-medium rounded-2xl bg-foreground text-background hover:bg-foreground/90"
          >
            Adicionar Registro
          </Button>
        </form>
      </div>
    </>
  )
}
