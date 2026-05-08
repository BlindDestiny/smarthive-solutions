import { cn } from '@/lib/utils'

const VARIANTS: Record<string, string> = {
  Confirmed:   'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Completed:   'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Active:      'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Published:   'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Approved:    'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Pending:     'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Scheduled:   'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  Trial:       'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Draft:       'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  Paused:      'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  Cancelled:   'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  'On Leave':  'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  'No Show':   'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  VIP:         'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  Corporate:   'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
  Regular:     'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  Occasional:  'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  Customer:    'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Lead:        'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  'On Sale':   'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
}

interface BadgeProps {
  label: string
  variant?: string
  className?: string
  dot?: boolean
}

export default function Badge({ label, variant, className, dot }: BadgeProps) {
  const cls = VARIANTS[variant ?? label] ?? 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium', cls, className)}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />}
      {label}
    </span>
  )
}
