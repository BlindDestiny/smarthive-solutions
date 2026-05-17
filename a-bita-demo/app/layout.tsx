import type { Metadata } from 'next'
import './globals.css'
import FloatingActions from '@/components/floating-actions'
import { ReservationProvider } from '@/components/reservation-provider'

export const metadata: Metadata = {
  title: "A Bita — Refeições caseiras & sobremesas no País das Maravilhas",
  description:
    "Brunch, refeições caseiras para take-away e sobremesas com história em Vila Nova de Gaia. Reserve a sua mesa no País das Maravilhas d'a Bita.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT">
      <body className="paper-bg">
        <ReservationProvider>
          {children}
          <FloatingActions />
        </ReservationProvider>
      </body>
    </html>
  )
}
