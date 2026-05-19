'use client'

import { useQuote } from './quote-provider'

export default function QuoteButton({
  label = 'Pedir Orçamento',
  variant = 'primary',
  className = '',
  preselectedService,
  children,
}: {
  label?: string
  variant?: 'primary' | 'ghost' | 'light' | 'outline-light'
  className?: string
  preselectedService?: string
  children?: React.ReactNode
}) {
  const { openQuote, setPreselected } = useQuote()
  const cls =
    variant === 'ghost'         ? 'btn-ghost' :
    variant === 'light'         ? 'btn-light' :
    variant === 'outline-light' ? 'btn-outline-light' :
                                  'btn-primary'
  return (
    <button onClick={() => { if (preselectedService) setPreselected(preselectedService); openQuote() }}
      className={`${cls} ${className}`}>
      {children || label}
    </button>
  )
}
