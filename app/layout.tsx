import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { FinanceProvider } from "@/context/finance-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PoupaDin - Controle Financeiro Pessoal",
  description: "Gerencie seu dinheiro de forma inteligente",
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: "#FBE6B5",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PoupaDin",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} font-sans antialiased`}>
        <FinanceProvider>{children}</FinanceProvider>
        <Analytics />
      </body>
    </html>
  )
}
