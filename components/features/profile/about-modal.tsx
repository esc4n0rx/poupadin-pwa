// components/features/profile/about-modal.tsx
"use client"

import React from 'react'
import { X, Heart, Github, Mail, Shield, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AboutModalProps {
  onClose: () => void
}

export function AboutModal({ onClose }: AboutModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl w-full max-w-md p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#2C3E50]">Sobre o Poupadin</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-[#7F8C8D]" />
          </button>
        </div>

        <div className="space-y-6 text-center">
          {/* Logo e Nome */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-[#1DD1A1] to-[#00A085] rounded-3xl flex items-center justify-center">
              <span className="text-3xl">💰</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#2C3E50]">Poupadin</h3>
              <p className="text-[#7F8C8D]">Versão 1.0.0</p>
            </div>
          </div>

          {/* Descrição */}
          <div className="p-4 bg-[#E8F8F5] rounded-2xl">
            <p className="text-[#2C3E50] text-sm leading-relaxed">
              Gerencie suas finanças de forma simples e inteligente. 
              O Poupadin ajuda você a controlar gastos, definir objetivos 
              e alcançar seus sonhos financeiros.
            </p>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#1DD1A1]">50k+</p>
              <p className="text-xs text-[#7F8C8D]">Usuários</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#1DD1A1]">R$ 1M+</p>
              <p className="text-xs text-[#7F8C8D]">Poupado</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#1DD1A1]">4.8★</p>
              <p className="text-xs text-[#7F8C8D]">Avaliação</p>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <FileText className="w-5 h-5 text-[#7F8C8D]" />
              <span className="text-[#2C3E50] font-medium">Termos de Uso</span>
            </button>
            
            <button className="w-full flex items-center justify-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <Shield className="w-5 h-5 text-[#7F8C8D]" />
              <span className="text-[#2C3E50] font-medium">Política de Privacidade</span>
            </button>
            
            <button className="w-full flex items-center justify-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <Mail className="w-5 h-5 text-[#7F8C8D]" />
              <span className="text-[#2C3E50] font-medium">Suporte</span>
            </button>
            
            <button className="w-full flex items-center justify-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <Github className="w-5 h-5 text-[#7F8C8D]" />
              <span className="text-[#2C3E50] font-medium">GitHub</span>
            </button>
          </div>

          {/* Créditos */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-[#7F8C8D] flex items-center justify-center space-x-1">
              <span>Feito com</span>
              <Heart className="w-3 h-3 text-red-500" />
              <span>pela equipe Poupadin</span>
            </p>
          </div>

          <Button onClick={onClose} className="w-full">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  )
}