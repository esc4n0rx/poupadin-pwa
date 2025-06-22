"use client"

import { ArrowLeft } from "lucide-react"

interface StepHeaderProps {
  title: string
  subtitle: string
  currentStep: number
  totalSteps: number
  onBack?: () => void
}

export function StepHeader({ title, subtitle, currentStep, totalSteps, onBack }: StepHeaderProps) {
  return (
    <div className="p-6 text-white">
      {onBack && (
        <button onClick={onBack} className="mb-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}

      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-white/90 mb-6">{subtitle}</p>

      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep

          return (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  isActive
                    ? "bg-white text-[#1DD1A1]"
                    : isCompleted
                      ? "bg-white/30 text-white"
                      : "bg-white/20 text-white/60"
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < totalSteps && <div className="w-8 h-0.5 bg-white/30 mx-2" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
