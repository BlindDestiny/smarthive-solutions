'use client'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  label: string
  value: string | number
  delta?: string
  deltaDir?: 'up' | 'down' | 'neutral'
  accent?: string
  prefix?: string
  suffix?: string
  delay?: number
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
}

function CountUp({ to, prefix = '', suffix = '', delay = 0 }: { to: number; prefix?: string; suffix?: string; delay?: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = Date.now()
      const duration = 1200
      const from = 0

      const tick = () => {
        const elapsed = Date.now() - start
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(Math.round(from + (to - from) * eased))
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, delay)
    return () => clearTimeout(timeout)
  }, [to, delay])

  return <>{prefix}{display.toLocaleString('pt-PT')}{suffix}</>
}

export default function KpiCard({
  label, value, delta, deltaDir = 'neutral', accent = '#3b82f6',
  prefix = '', suffix = '', delay = 0, icon: Icon
}: KpiCardProps) {
  const isNumeric = typeof value === 'number'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="bg-white rounded-xl border border-slate-200 p-5 cursor-default card-hover overflow-hidden relative"
      style={{ borderLeftWidth: 3, borderLeftColor: accent }}
    >
      {/* Background glow */}
      <div
        className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-[0.04] -translate-y-4 translate-x-4"
        style={{ background: accent, filter: 'blur(16px)' }}
      />

      {Icon && (
        <div className="mb-3 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: accent + '18' }}>
          <Icon className="w-4 h-4" style={{ color: accent }} />
        </div>
      )}

      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</div>

      <div className="text-2xl font-bold text-slate-900 tracking-tight mb-1.5">
        {isNumeric ? (
          <CountUp to={value as number} prefix={prefix} suffix={suffix} delay={delay * 1000} />
        ) : (
          <>{prefix}{value}{suffix}</>
        )}
      </div>

      {delta && (
        <div className={cn(
          'flex items-center gap-1 text-xs font-medium',
          deltaDir === 'up' ? 'text-emerald-600' : deltaDir === 'down' ? 'text-rose-500' : 'text-slate-400'
        )}>
          {deltaDir === 'up' && <TrendingUp className="w-3 h-3" />}
          {deltaDir === 'down' && <TrendingDown className="w-3 h-3" />}
          {deltaDir === 'neutral' && <Minus className="w-3 h-3" />}
          {delta}
        </div>
      )}
    </motion.div>
  )
}
