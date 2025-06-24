// components/features/auth/forgot-password-flow.tsx
"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Mail, Shield, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ForgotPasswordApi } from '@/lib/forgot-password-api'
import { VerifyCodeStep } from './verify-code-step'
import { ResetPasswordStep } from './reset-password-step'
import { ForgotPasswordStep, ForgotPasswordState } from '@/types/forgot-password'

interface ForgotPasswordFlowProps {
  onNavigateToLogin: () => void
}

export function ForgotPasswordFlow({ onNavigateToLogin }: ForgotPasswordFlowProps) {
  const [state, setState] = useState<ForgotPasswordState>({
    step: 'email',
    email: '',
    code: '',
    isLoading: false,
    error: '',
  })

  const updateState = (updates: Partial<ForgotPasswordState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!state.email.trim()) {
      updateState({ error: 'Email é obrigatório' })
      return
    }

    updateState({ isLoading: true, error: '' })

    try {
      await ForgotPasswordApi.sendResetCode({ email: state.email })
      updateState({ step: 'verify-code', isLoading: false })
    } catch (error) {
      updateState({
        error: error instanceof Error ? error.message : 'Erro ao enviar código',
        isLoading: false
      })
    }
  }

  const handleVerifyCode = async (code: string) => {
    updateState({ isLoading: true, error: '', code })

    try {
      const response = await ForgotPasswordApi.verifyResetCode({ code })
      if (response.valid) {
        updateState({ step: 'reset-password', isLoading: false })
      } else {
        updateState({ 
          error: 'Código inválido ou expirado',
          isLoading: false 
        })
      }
    } catch (error) {
      updateState({
        error: error instanceof Error ? error.message : 'Erro ao verificar código',
        isLoading: false
      })
    }
  }

  const handleResetPassword = async (password: string) => {
    updateState({ isLoading: true, error: '' })

    try {
      await ForgotPasswordApi.resetPassword({ 
        code: state.code, 
        password 
      })
      updateState({ step: 'success', isLoading: false })
    } catch (error) {
      updateState({
        error: error instanceof Error ? error.message : 'Erro ao redefinir senha',
        isLoading: false
      })
    }
  }

  const stepVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  }

  const renderEmailStep = () => (
    <motion.div
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col"
    >
      {/* Header */}
      <div className="bg-[#1DD1A1] pt-16 pb-20 px-6 relative">
        <button
          onClick={onNavigateToLogin}
          className="absolute top-16 left-6 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="text-center mt-8">
          <h1 className="text-2xl font-bold text-white mb-2">Esqueci Minha Senha</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-6 pt-8 px-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#E8F8F5] rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-[#1DD1A1]" />
          </div>
          <h2 className="text-xl font-bold text-[#2C3E50] mb-2">Redefinir Senha?</h2>
          <p className="text-[#7F8C8D] leading-relaxed">
            Digite seu endereço de email e enviaremos um código de verificação para redefinir sua senha.
          </p>
        </div>

        <form onSubmit={handleSendCode} className="space-y-6">
          <div>
            <Input
              type="email"
              label="Digite seu Email"
              value={state.email}
              onChange={(e) => updateState({ email: e.target.value, error: '' })}
              placeholder="exemplo@exemplo.com"
              error={state.error}
              disabled={state.isLoading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            loading={state.isLoading}
          >
            Próximo Passo
          </Button>
        </form>

        <div className="text-center mt-8 mb-6">
          <span className="text-[#7F8C8D]">Não tem uma conta? </span>
          <button 
            onClick={onNavigateToLogin}
            className="text-[#1DD1A1] hover:text-[#00A085] font-medium transition-colors"
          >
            Criar Conta
          </button>
        </div>
      </div>
    </motion.div>
  )

  const renderSuccessStep = () => (
    <motion.div
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col"
    >
      {/* Header */}
      <div className="bg-[#1DD1A1] pt-16 pb-20 px-6">
        <div className="text-center mt-8">
          <h1 className="text-2xl font-bold text-white mb-2">Senha Redefinida!</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-6 pt-8 px-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-[#2C3E50] mb-2">Sucesso!</h2>
          <p className="text-[#7F8C8D] leading-relaxed">
            Sua senha foi redefinida com sucesso. Você pode fazer login com sua nova senha.
          </p>
        </div>

        <Button 
          onClick={onNavigateToLogin}
          className="w-full"
        >
          Voltar ao Login
        </Button>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-[#F0F4F3] flex flex-col">
      <AnimatePresence mode="wait">
        {state.step === 'email' && renderEmailStep()}
        {state.step === 'verify-code' && (
          <VerifyCodeStep
            email={state.email}
            isLoading={state.isLoading}
            error={state.error}
            onVerifyCode={handleVerifyCode}
            onBack={() => updateState({ step: 'email', error: '' })}
            onResendCode={() => handleSendCode({ preventDefault: () => {} } as React.FormEvent)}
          />
        )}
        {state.step === 'reset-password' && (
          <ResetPasswordStep
            isLoading={state.isLoading}
            error={state.error}
            onResetPassword={handleResetPassword}
            onBack={() => updateState({ step: 'verify-code', error: '' })}
          />
        )}
        {state.step === 'success' && renderSuccessStep()}
      </AnimatePresence>
    </div>
  )
}