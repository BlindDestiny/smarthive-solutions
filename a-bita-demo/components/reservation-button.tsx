'use client'

import { Calendar } from 'lucide-react'
import { useReservation } from './reservation-provider'

export default function ReservationButton({
  label = 'Reservar Mesa',
  variant = 'primary',
  className = '',
}: {
  label?: string
  variant?: 'primary' | 'gold' | 'cream' | 'ghost'
  className?: string
}) {
  const { openReservation } = useReservation()
  const cls =
    variant === 'gold'  ? 'btn-gold'  :
    variant === 'cream' ? 'btn-cream' :
    variant === 'ghost' ? 'btn-ghost' :
                          'btn-primary'
  return (
    <button onClick={openReservation} className={`${cls} ${className}`}>
      <Calendar size={14} /> {label}
    </button>
  )
}
