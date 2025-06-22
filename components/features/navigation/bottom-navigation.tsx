"use client"

import { Home, BarChart3, Target, Grid3X3, User } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

const navigationItems = [
  { href: "/dashboard", icon: Home, label: "Início" },
  { href: "/analytics", icon: BarChart3, label: "Objetivos" },
  { href: "/goals", icon: Target, label: "" },
  { href: "/categories", icon: Grid3X3, label: "Categorias" },
  { href: "/profile", icon: User, label: "Perfil" },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const isCenter = item.href === "/goals"

          if (isCenter) {
            return (
              <Link key={item.href} href={item.href}>
                <div className="w-14 h-14 bg-[#1DD1A1] rounded-full flex items-center justify-center shadow-lg">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
              </Link>
            )
          }

          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center space-y-1">
              <item.icon className={cn("w-6 h-6", isActive ? "text-[#1DD1A1]" : "text-[#7F8C8D]")} />
              <span className={cn("text-xs", isActive ? "text-[#1DD1A1] font-medium" : "text-[#7F8C8D]")}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
