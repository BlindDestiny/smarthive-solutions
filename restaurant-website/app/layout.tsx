import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'The Venue — Fine Dining Lisboa',
  description: 'Restaurante premium em Lisboa. Fine dining, cocktails artesanais e música ao vivo. Terça a Domingo das 18h às 02h.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-[#080808] text-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
