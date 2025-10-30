"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CalendarProps {
  selectedDate: Date
  onSelectDate: (date: Date) => void
}

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

export function Calendar({ selectedDate, onSelectDate }: CalendarProps) {
  const today = new Date()
  const currentWeek = getWeekDays(selectedDate)

  function getWeekDays(date: Date) {
    const week = []
    const current = new Date(date)
    const day = current.getDay()
    const diff = current.getDate() - day

    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(current.setDate(diff + i))
      week.push(weekDay)
    }

    return week
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  return (
    <div className="bg-card border-b border-border">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {selectedDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          </h2>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-lg"
              onClick={() => {
                const newDate = new Date(selectedDate)
                newDate.setDate(newDate.getDate() - 7)
                onSelectDate(newDate)
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-lg"
              onClick={() => {
                const newDate = new Date(selectedDate)
                newDate.setDate(newDate.getDate() + 7)
                onSelectDate(newDate)
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {currentWeek.map((date, index) => {
            const isSelected = isSameDay(date, selectedDate)
            const isToday = isSameDay(date, today)

            return (
              <button
                key={index}
                onClick={() => onSelectDate(date)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
                  isSelected ? "bg-foreground text-background" : isToday ? "bg-accent" : "hover:bg-accent"
                }`}
              >
                <span className="text-xs font-medium mb-1">{weekDays[date.getDay()]}</span>
                <span className="text-lg font-bold">{date.getDate()}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
