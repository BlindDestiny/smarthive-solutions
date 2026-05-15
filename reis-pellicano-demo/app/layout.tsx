import type { Metadata } from 'next'
import './globals.css'
import FloatingActions from '@/components/floating-actions'
import { BookingProvider } from '@/components/booking-provider'

export const metadata: Metadata = {
  title: 'Reis & Pellicano — International Lawyers',
  description: 'Sociedade de advogados multicultural com presença em Lisboa, Porto e Faro. Direito imobiliário, nacionalidade portuguesa, vistos gold, fiscal e empresarial.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT">
      <body>
        <BookingProvider>
          {children}
          <FloatingActions />
        </BookingProvider>
      </body>
    </html>
  )
}
