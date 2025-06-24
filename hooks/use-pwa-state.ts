// hooks/use-pwa-state.ts
"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PWAState {
  isInstalled: boolean
  hasSeenInstallPrompt: boolean
  installPromptDismissedAt: number | null
  setInstalled: (installed: boolean) => void
  setHasSeenInstallPrompt: (seen: boolean) => void
  setInstallPromptDismissed: () => void
  shouldShowInstallPrompt: () => boolean
}

export const usePWAState = create<PWAState>()(
  persist(
    (set, get) => ({
      isInstalled: false,
      hasSeenInstallPrompt: false,
      installPromptDismissedAt: null,
      
      setInstalled: (installed) => set({ isInstalled: installed }),
      
      setHasSeenInstallPrompt: (seen) => set({ hasSeenInstallPrompt: seen }),
      
      setInstallPromptDismissed: () => set({ 
        installPromptDismissedAt: Date.now(),
        hasSeenInstallPrompt: true 
      }),
      
      shouldShowInstallPrompt: () => {
        const state = get()
        if (state.isInstalled) return false
        if (!state.hasSeenInstallPrompt) return true
        
        // Se foi dispensado, esperar 7 dias antes de mostrar novamente
        if (state.installPromptDismissedAt) {
          const daysPassed = (Date.now() - state.installPromptDismissedAt) / (1000 * 60 * 60 * 24)
          return daysPassed >= 7
        }
        
        return true
      },
    }),
    {
      name: 'pwa-state',
    }
  )
)