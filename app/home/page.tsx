"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Calendar } from "@/components/calendar"
import { RecordList } from "@/components/record-list"
import { BottomNav } from "@/components/bottom-nav"
import { AddRecordModal } from "@/components/add-record-modal"
import { Menu, Search, Bell, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("records")
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="rounded-xl">
            <Menu className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Registros</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

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
    </div>
  )
}
