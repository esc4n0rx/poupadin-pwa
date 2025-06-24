// components/features/auth/reset-password-step.tsx
"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ResetPasswordStepProps {
  isLoading: boolean
  error: string
  onResetPassword: (password: string) => void
  onBack: () => void
}

export function ResetPasswordStep({
  isLoading,
  error,
  onResetPassword,
  onBack
}: ResetPasswordStepProps) {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formError, setFormError] = useState('')

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (formError) setFormError('')
  }

  const validateForm = (): string | null => {
    if (formData.password.length < 8) {
      return 'A senha deve ter pelo menos 8 caracteres'
    }

    if (formData.password !== formData.confirmPassword) {
      return 'As senhas não coincidem'
    }

    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setFormError(validationError)
      return
    }

    onResetPassword(formData.password)
  }

  const currentError = formError || error

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
          <h1 className="text-2xl font-bold text-white mb-2">Nova Senha</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-6 pt-8 px-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#E8F8F5] rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-[#1DD1A1]" />
          </div>
          <h2 className="text-xl font-bold text-[#2C3E50] mb-2">Criar Nova Senha</h2>
          <p className="text-[#7F8C8D] leading-relaxed">
            Digite sua nova senha. Certifique-se de que seja segura e fácil de lembrar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Nova Senha"
              value={formData.password}
              onChange={handleChange('password')}
              placeholder="Mínimo 8 caracteres"
              disabled={isLoading}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#7F8C8D] hover:text-[#2C3E50] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
            />
          </div>

          <div>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirmar Senha"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              placeholder="Digite a senha novamente"
              disabled={isLoading}
              error={currentError}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-[#7F8C8D] hover:text-[#2C3E50] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            loading={isLoading}
          >
            Redefinir Senha
          </Button>
        </form>
      </div>
    </motion.div>
  )
}