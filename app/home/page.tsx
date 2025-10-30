"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AddRecordModal } from "@/components/add-record-modal"
import { BottomNav } from "@/components/bottom-nav"
import { RecordList } from "@/components/record-list"
import { Plus, Settings, Menu } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"
import { Calendar } from "@/components/calendar"
import { Sidebar } from "@/components/sidebar"

export default function HomePage() {
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState("home")
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Proteção de rota - redirecionar se não estiver autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Loading durante verificação de autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-foreground" />
      </div>
    )
  }

  // Se não estiver autenticado, não renderizar nada (redirecionamento em andamento)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">PoupaDin</h1>
              <p className="text-sm text-muted-foreground">Olá, {user.name}!</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/settings")}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
     {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />

        <div className="p-4">
          {activeTab === "records" && <RecordList date={selectedDate} />}
          {activeTab === "stats" && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Análises em breve</p>
            </div>
          )}
          {activeTab === "budgets" && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Orçamentos em breve</p>
            </div>
          )}
          {activeTab === "goals" && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Objetivos em breve</p>
            </div>
          )}
          {activeTab === "categories" && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Categorias em breve</p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <Button
        onClick={() => setAddModalOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-lg bg-foreground text-background hover:bg-foreground/90 z-30"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Add Record Modal */}
      <AddRecordModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />
    </div>
  )
}