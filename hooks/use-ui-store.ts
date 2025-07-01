import { create } from 'zustand'

interface UIState {
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
}

/**
 * Store global para controlar estados da UI, como a visibilidade de modais.
 * Isso permite que componentes como a barra de navegação reajam à abertura/fechamento
 * de qualquer modal na aplicação.
 */
export const useUIStore = create<UIState>((set) => ({
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}))