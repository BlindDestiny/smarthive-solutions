import type { Metadata } from 'next'
import './globals.css'
import FloatingActions from '@/components/floating-actions'
import ScrollProgress from '@/components/scroll-progress'
import { QuoteProvider } from '@/components/quote-provider'

export const metadata: Metadata = {
  title: 'Rogério Custódio — Carpintaria por medida · Estoi · Algarve',
  description:
    'Carpintaria e marcenaria por medida desde 2006. Cozinhas, roupeiros, mobiliário personalizado, projetos residenciais e comerciais — em Estoi, ao serviço de todo o Algarve.',
  keywords: 'carpintaria Faro, marcenaria Algarve, cozinhas por medida, roupeiros por medida, móveis personalizados, carpintaria Estoi',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT">
      <body>
        <QuoteProvider>
          <ScrollProgress />
          {children}
          <FloatingActions />
        </QuoteProvider>
      </body>
    </html>
  )
}
