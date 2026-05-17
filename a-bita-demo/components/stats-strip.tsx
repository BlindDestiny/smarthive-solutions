'use client'

import { useEffect, useRef, useState } from 'react'
import { stats } from '@/lib/content'

export default function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect() } },
      { threshold: 0.3 }
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} className="bg-bita-forest text-bita-cream">
      <div className="container-bita py-16 md:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-bita-cream/10 border border-bita-cream/10">
          {stats.map((s, i) => (
            <StatCell key={i} stat={s} animate={visible} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatCell({
  stat,
  animate,
  delay,
}: {
  stat: { value: string; suffix?: string; label: string; sub?: string }
  animate: boolean
  delay: number
}) {
  const numeric = parseFloat(stat.value)
  const isNumber = !Number.isNaN(numeric)
  const [display, setDisplay] = useState(isNumber ? '0' : stat.value)

  useEffect(() => {
    if (!animate || !isNumber) return
    const start = performance.now()
    const duration = 1400
    const decimals = (stat.value.split('.')[1] || '').length

    let frameId = 0
    const tick = (now: number) => {
      const elapsed = now - start - delay
      if (elapsed < 0) { frameId = requestAnimationFrame(tick); return }
      const p = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay((numeric * eased).toFixed(decimals))
      if (p < 1) frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [animate, isNumber, numeric, stat.value, delay])

  return (
    <div className="bg-bita-forest p-8 md:p-10 text-center">
      <div className="flex items-baseline justify-center gap-1">
        <span className="font-display text-5xl md:text-6xl text-bita-cream tabular-nums italic">
          {display}
        </span>
        {stat.suffix && (
          <span className="font-display text-3xl md:text-4xl text-bita-goldLight">
            {stat.suffix}
          </span>
        )}
      </div>
      <div className="mt-4 text-[11px] uppercase tracking-widest2 text-bita-cream/85">
        {stat.label}
      </div>
      {stat.sub && (
        <div className="mt-2 text-xs text-bita-cream/55 leading-relaxed">
          {stat.sub}
        </div>
      )}
    </div>
  )
}
