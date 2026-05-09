import type { Metadata } from 'next'
import { Syne, Inter } from 'next/font/google'
import './globals.css'

const syne = Syne({ subsets:['latin'], weight:['400','600','700','800'], variable:'--font-syne', display:'swap' })
const inter = Inter({ subsets:['latin'], variable:'--font-inter', display:'swap' })

export const metadata: Metadata = {
  title: 'SparkClean — Limpeza Profissional em Lisboa',
  description: 'Serviços de limpeza profissional para casas e escritórios em Lisboa. Residencial, comercial, pós-obra e muito mais. Orçamento grátis.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={`${syne.variable} ${inter.variable}`}>
      <body className="bg-white text-[#0f172a] antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
