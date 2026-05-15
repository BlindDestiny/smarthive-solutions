'use client'

import { Calendar } from 'lucide-react'
import { useBooking } from './booking-provider'

export default function BookingButton({
  label = 'Agendar Online',
  variant = 'primary',
  className = '',
}: {
  label?: string
  variant?: 'primary' | 'ghost' | 'light'
  className?: string
}) {
  const { openBooking } = useBooking()
  const base = variant === 'primary' ? 'btn-primary' : variant === 'light' ? 'btn-light' : 'btn-ghost'
  return (
    <button onClick={openBooking} className={`${base} ${className}`}>
      <Calendar size={14} /> {label}
    </button>
  )
}
