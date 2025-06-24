// components/features/auth/verify-code-step.tsx
"use client"

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VerifyCodeStepProps {
  email: string
  isLoading: boolean
  error: string
  onVerifyCode: (code: string) => void
  onBack: () => void
  onResendCode: () => void
}

export function VerifyCodeStep({
  email,
  isLoading,
  error,
  onVerifyCode,
  onBack,
  onResendCode
}: VerifyCodeStepProps) {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [resendTimer, setResendTimer] = useState(60)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focar no primeiro input ao montar
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    // Timer para reenvio
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleCodeChange = (index: number, value: string) => {
    // Aceitar apenas números
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value.slice(-1) // Apenas último dígito

    setCode(newCode)

    // Auto avançar para próximo input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Verificar código automaticamente quando completo
    if (newCode.every(digit => digit) && newCode.join('').length === 6) {
      onVerifyCode(newCode.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Voltar para input anterior se atual estiver vazio
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    
    if (pastedData.length === 6) {
      const newCode = pastedData.split('')
      setCode(newCode)
      onVerifyCode(pastedData)
    }
  }

  const handleResend = () => {
    if (resendTimer === 0) {
      setResendTimer(60)
      onResendCode()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col"
    >
      {/* Header */}
      <div className="bg-[#1DD1A1] pt-16 pb-20 px-6 relative">
        <button
          onClick={onBack}
          className="absolute top-16 left-6 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="text-center mt-8">
          <h1 className="text-2xl font-bold text-white mb-2">Código de Verificação</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-6 pt-8 px-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#E8F8F5] rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-[#1DD1A1]" />
          </div>
          <h2 className="text-xl font-bold text-[#2C3E50] mb-2">Digite o Código</h2>
          <p className="text-[#7F8C8D] leading-relaxed">
            Enviamos um código de 6 dígitos para{' '}
            <span className="font-medium text-[#2C3E50]">{email}</span>. 
            Digite o código abaixo para continuar.
          </p>
        </div>

        {/* Code Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-[#2C3E50] mb-4">
            Código de Verificação
          </label>
          
          <div className="flex justify-center space-x-3 mb-4">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleCodeChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={isLoading}
                className={`
                  w-12 h-12 text-center text-xl font-bold border-2 rounded-xl
                  transition-all duration-200 focus:outline-none
                  ${digit 
                    ? 'border-[#1DD1A1] bg-[#E8F8F5] text-[#2C3E50]' 
                    : 'border-gray-200 bg-white text-[#7F8C8D]'
                  }
                  ${error ? 'border-red-500' : ''}
                  focus:border-[#1DD1A1] focus:bg-[#E8F8F5]
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              />
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center mt-2">{error}</p>
          )}
        </div>

        <Button 
          onClick={() => onVerifyCode(code.join(''))}
          className="w-full mb-6" 
          loading={isLoading}
          disabled={code.join('').length !== 6}
        >
          Verificar Código
        </Button>

        <div className="text-center">
          <span className="text-[#7F8C8D]">Não recebeu o código? </span>
          <button 
            onClick={handleResend}
            disabled={resendTimer > 0}
            className={`font-medium transition-colors ${
              resendTimer > 0 
                ? 'text-[#7F8C8D] cursor-not-allowed' 
                : 'text-[#1DD1A1] hover:text-[#00A085]'
            }`}
          >
            {resendTimer > 0 ? `Reenviar (${resendTimer}s)` : 'Reenviar'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}