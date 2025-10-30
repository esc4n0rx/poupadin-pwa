"use client"

import { X, Download, Database, Trash2, Heart, MessageSquare, Users, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-sidebar text-sidebar-foreground z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">PoupaDin</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-sidebar-foreground hover:bg-sidebar-accent rounded-xl"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-sidebar-accent rounded-xl">
              <Avatar className="w-12 h-12">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">João Silva</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">joao@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase mb-2 px-3">Gerenciamento</h3>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12 px-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-xl"
                  >
                    <Download className="w-5 h-5" />
                    <span>Exportar registros</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12 px-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-xl"
                  >
                    <Database className="w-5 h-5" />
                    <span>Backup & Restauração</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12 px-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-xl"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Redefinir & Apagar</span>
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase mb-2 px-3">Aplicativo</h3>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12 px-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-xl"
                  >
                    <Heart className="w-5 h-5" />
                    <span>Curtir PoupaDin</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12 px-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-xl"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Feedback & Suporte</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12 px-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-xl"
                  >
                    <Users className="w-5 h-5" />
                    <span>Convidar amigos</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Go Pro Section */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 text-white">
              <div className="flex items-start gap-3 mb-3">
                <Crown className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-sm mb-1">Seja Pro</h3>
                  <p className="text-xs opacity-90 leading-relaxed">
                    Conecte sua conta bancária e atualize suas transações automaticamente.
                  </p>
                </div>
              </div>
              <Button className="w-full bg-white text-orange-600 hover:bg-white/90 rounded-xl h-10 font-semibold">
                Atualizar
              </Button>
            </div>
            <p className="text-center text-xs text-sidebar-foreground/60 mt-3">3 de 30 dias usados</p>
          </div>
        </div>
      </div>
    </>
  )
}
