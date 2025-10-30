"use client"

import { Receipt, BarChart3, Wallet, Target, Grid3x3 } from "lucide-react"

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "records", label: "Registros", icon: Receipt },
  { id: "stats", label: "Análises", icon: BarChart3 },
  { id: "budgets", label: "Orçamentos", icon: Wallet },
  { id: "goals", label: "Objetivos", icon: Target },
  { id: "categories", label: "Categorias", icon: Grid3x3 },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "fill-current" : ""}`} />
              <span className="text-xs font-medium">{tab.label}</span>
              {isActive && <div className="absolute bottom-0 w-1 h-1 bg-foreground rounded-full" />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
