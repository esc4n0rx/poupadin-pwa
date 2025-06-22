import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { BudgetProvider } from "@/contexts/budget-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Poupadin Web",
  description: "Gerencie suas finanças de forma simples e inteligente",
  manifest: "/manifest.json",
  themeColor: "#1DD1A1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <BudgetProvider>{children}</BudgetProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
