'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import QuoteModal from './quote-modal'

type Ctx = { open: boolean; openQuote: () => void; closeQuote: () => void; preselectedService: string | null; setPreselected: (s: string | null) => void }
const QuoteContext = createContext<Ctx | null>(null)

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [preselectedService, setPreselected] = useState<string | null>(null)
  const openQuote  = useCallback(() => setOpen(true), [])
  const closeQuote = useCallback(() => { setOpen(false); setPreselected(null) }, [])

  return (
    <QuoteContext.Provider value={{ open, openQuote, closeQuote, preselectedService, setPreselected }}>
      {children}
      <QuoteModal open={open} onClose={closeQuote} preselectedService={preselectedService} />
    </QuoteContext.Provider>
  )
}

export function useQuote() {
  const ctx = useContext(QuoteContext)
  if (!ctx) throw new Error('useQuote must be used within QuoteProvider')
  return ctx
}
