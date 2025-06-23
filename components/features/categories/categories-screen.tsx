"use client"

import { useState } from 'react'
import { Grid3X3, BarChart3, ArrowRight, RefreshCw } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BottomNavigation } from '@/components/features/navigation/bottom-navigation'
import { CategoriesStatistics } from './categories-statistics'
import { CategoryTransferModal } from './category-transfer-modal'
import { useCategories } from '@/hooks/use-categories'
import { CategoryTransferRequest } from '@/types/categories'
import { formatCurrency } from '@/lib/utils'

export function CategoriesScreen() {
  const { categories, loading, error, transferBetweenCategories } = useCategories()
  const [viewMode, setViewMode] = useState<'categories' | 'statistics'>('categories')
  const [showTransferModal, setShowTransferModal] = useState(false)

  // Calcular totais
  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.allocated_amount, 0)
  const totalAvailable = categories.reduce((sum, cat) => sum + cat.current_balance, 0)
  const availablePercentage = totalBudgeted > 0 ? (totalAvailable / totalBudgeted) * 100 : 0

  const handleTransfer = async (data: CategoryTransferRequest) => {
    try {
      await transferBetweenCategories(data)
      // Toast de sucesso poderia ser adicionado aqui
    } catch (error) {
      console.error('Erro na transferência:', error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1DD1A1] to-[#00A085] flex items-center justify-center">
        <div className="text-white text-lg">Carregando categorias...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1DD1A1] to-[#00A085] flex items-center justify-center p-6">
        <Card className="p-6 text-center max-w-md">
          <h2 className="text-lg font-bold text-red-600 mb-2">Erro ao Carregar</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1DD1A1] to-[#00A085] pb-20">
      {/* Header */}
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Gerenciar Categorias</h1>
        <p className="text-white/90 mb-6">
          {categories.length} categorias • {availablePercentage.toFixed(1)}% disponível
        </p>

        {/* Mode Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="flex bg-white/20 rounded-2xl p-1">
            <button
              onClick={() => setViewMode('categories')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                viewMode === 'categories' 
                  ? 'bg-white text-[#1DD1A1]' 
                  : 'text-white/80'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="font-medium">Categorias</span>
            </button>
            <button
              onClick={() => setViewMode('statistics')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                viewMode === 'statistics' 
                  ? 'bg-white text-[#1DD1A1]' 
                  : 'text-white/80'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="font-medium">Estatísticas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#F0F4F3] rounded-t-3xl min-h-[calc(100vh-200px)] p-6">
        {viewMode === 'statistics' ? (
          <CategoriesStatistics categories={categories} />
        ) : (
          <div>
            {/* Resumo Rápido */}
            <div className="mb-6 p-4 bg-white rounded-2xl">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-[#2C3E50]">{categories.length}</p>
                  <p className="text-sm text-[#7F8C8D]">Categorias</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#2C3E50]">{formatCurrency(totalBudgeted).replace('R$', 'R$').replace(',00', '')}</p>
                  <p className="text-sm text-[#7F8C8D]">Total Orçado</p>
               </div>
               <div>
                 <p className="text-2xl font-bold text-[#1DD1A1]">{formatCurrency(totalAvailable).replace('R$', 'R$').replace(',00', '')}</p>
                 <p className="text-sm text-[#7F8C8D]">Disponível</p>
               </div>
             </div>
           </div>

           {/* Botão de Transferência */}
           <Button
             onClick={() => setShowTransferModal(true)}
             className="w-full mb-6 bg-[#1DD1A1] text-white"
           >
             <RefreshCw className="w-5 h-5 mr-2" />
             Transferir entre Categorias
           </Button>

           {/* Lista de Categorias */}
           {categories.length === 0 ? (
             <div className="text-center py-12">
               <div className="w-16 h-16 bg-[#E8F8F5] rounded-full flex items-center justify-center mx-auto mb-4">
                 <Grid3X3 className="w-8 h-8 text-[#1DD1A1]" />
               </div>
               <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Nenhuma categoria encontrada</h3>
               <p className="text-[#7F8C8D]">Configure suas categorias de orçamento primeiro.</p>
             </div>
           ) : (
             <div className="space-y-4">
               {categories.map((category) => {
                 const spentAmount = category.allocated_amount - category.current_balance
                 const spentPercentage = category.allocated_amount > 0 ? (spentAmount / category.allocated_amount) * 100 : 0

                 return (
                   <Card key={category.id} className="p-4">
                     <div className="flex items-center justify-between mb-3">
                       <div className="flex items-center space-x-3">
                         <div 
                           className="w-6 h-6 rounded-full" 
                           style={{ backgroundColor: category.color }}
                         />
                         <div>
                           <h3 className="font-semibold text-[#2C3E50]">{category.name}</h3>
                           <p className="text-sm text-[#7F8C8D]">
                             Disponível: {formatCurrency(category.current_balance)}
                           </p>
                         </div>
                       </div>
                       <button className="p-2 hover:bg-gray-100 rounded-full">
                         <ArrowRight className="w-4 h-4 text-[#1DD1A1]" />
                       </button>
                     </div>

                     <div className="space-y-2">
                       <div className="flex justify-between text-sm">
                         <span className="text-[#7F8C8D]">Orçado:</span>
                         <span className="font-medium text-[#2C3E50]">{formatCurrency(category.allocated_amount)}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-[#7F8C8D]">Gasto:</span>
                         <span className="font-medium text-red-500">{formatCurrency(spentAmount)}</span>
                       </div>
                     </div>

                     <div className="mt-3">
                       <div className="w-full bg-gray-200 rounded-full h-2">
                         <div
                           className="h-2 rounded-full transition-all duration-300"
                           style={{ 
                             width: `${Math.min(spentPercentage, 100)}%`,
                             backgroundColor: category.color
                           }}
                         />
                       </div>
                       <div className="flex justify-between items-center mt-1">
                         <p className="text-xs text-[#7F8C8D]">{spentPercentage.toFixed(1)}% usado</p>
                         <p className="text-xs text-[#7F8C8D]">
                           {spentPercentage < 50 ? '🟢' : spentPercentage < 80 ? '🟡' : '🔴'}
                         </p>
                       </div>
                     </div>
                   </Card>
                 )
               })}
             </div>
           )}
         </div>
       )}
     </div>

     <BottomNavigation />

     {/* Modal de Transferência */}
     {showTransferModal && (
       <CategoryTransferModal
         categories={categories}
         onClose={() => setShowTransferModal(false)}
         onTransfer={handleTransfer}
       />
     )}
   </div>
 )
}