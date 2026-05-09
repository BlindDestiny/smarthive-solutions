import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Porto dos Ribeiros — Comida Brasileira no Porto',
  description: 'Restaurante brasileiro autêntico no Porto. Feijoada, picanha, stroganoff e muito mais. Rua da Constituição 982 · Aberto todos os dias · 963 349 411',
  keywords: 'restaurante brasileiro porto, feijoada porto, comida brasileira porto, picanha porto',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-[#0a0f08] text-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
