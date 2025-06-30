"use client"

import React from 'react'
import { X, Heart, Github, Mail, Shield, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AboutModalProps {
  onClose: () => void
}

export function AboutModal({ onClose }: AboutModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-popup">
        <div className="modal-header">
          <h2 className="text-xl font-bold text-[#2C3E50]">Sobre o Poupadin</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-[#7F8C8D]" />
          </button>
        </div>

        <div className="modal-body">
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

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="p-3 bg-white rounded-xl border border-gray-100">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <h4 className="font-medium text-[#2C3E50] text-sm">Seguro</h4>
                <p className="text-xs text-[#7F8C8D]">Seus dados protegidos</p>
              </div>
              
              <div className="p-3 bg-white rounded-xl border border-gray-100">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <Heart className="w-4 h-4 text-green-600" />
                </div>
                <h4 className="font-medium text-[#2C3E50] text-sm">Simples</h4>
                <p className="text-xs text-[#7F8C8D]">Fácil de usar</p>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-3">
              <button className="w-full p-4 bg-white rounded-xl border border-gray-100 flex items-center space-x-3 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-[#2C3E50]">Termos de Uso</h4>
                  <p className="text-sm text-[#7F8C8D]">Leia nossos termos</p>
                </div>
              </button>

              <button className="w-full p-4 bg-white rounded-xl border border-gray-100 flex items-center space-x-3 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-[#2C3E50]">Política de Privacidade</h4>
                  <p className="text-sm text-[#7F8C8D]">Como protegemos seus dados</p>
                </div>
              </button>

              <button className="w-full p-4 bg-white rounded-xl border border-gray-100 flex items-center space-x-3 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-[#2C3E50]">Suporte</h4>
                  <p className="text-sm text-[#7F8C8D]">contato@poupadin.com</p>
                </div>
              </button>
            </div>

            {/* Copyright */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-[#7F8C8D]">
                © 2025 Poupadin. Todos os direitos reservados.
              </p>
              <p className="text-xs text-[#7F8C8D] mt-1">
                Feito com <Heart className="w-3 h-3 inline text-red-500" /> para suas finanças
              </p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <Button onClick={onClose} className="w-full">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  )
}