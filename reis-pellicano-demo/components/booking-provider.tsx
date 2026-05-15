'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import BookingModal from './booking-modal'

type Ctx = { open: boolean; openBooking: () => void; closeBooking: () => void }
const BookingContext = createContext<Ctx | null>(null)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const openBooking = useCallback(() => setOpen(true), [])
  const closeBooking = useCallback(() => setOpen(false), [])

  return (
    <BookingContext.Provider value={{ open, openBooking, closeBooking }}>
      {children}
      <BookingModal open={open} onClose={closeBooking} />
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}
