// app/providers.tsx
"use client"

import type { ReactNode } from 'react'
import { PWAProvider } from '@/components/pwa-provider'
import { AuthProvider } from '@/contexts/auth-context'
import { BudgetProvider } from '@/contexts/budget-context'
import { AccessControlWrapper } from '@/components/access-control-wrapper'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <PWAProvider>
      <AuthProvider>
        <BudgetProvider>
          <AccessControlWrapper>
            {children}
          </AccessControlWrapper>
        </BudgetProvider>
      </AuthProvider>
    </PWAProvider>
  )
}