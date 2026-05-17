'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import ReservationModal from './reservation-modal'

type Ctx = { open: boolean; openReservation: () => void; closeReservation: () => void }
const ReservationContext = createContext<Ctx | null>(null)

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const openReservation = useCallback(() => setOpen(true), [])
  const closeReservation = useCallback(() => setOpen(false), [])

  return (
    <ReservationContext.Provider value={{ open, openReservation, closeReservation }}>
      {children}
      <ReservationModal open={open} onClose={closeReservation} />
    </ReservationContext.Provider>
  )
}

export function useReservation() {
  const ctx = useContext(ReservationContext)
  if (!ctx) throw new Error('useReservation must be used within ReservationProvider')
  return ctx
}
