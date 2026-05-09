'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { motion } from 'framer-motion'

function Counter({ to, suffix = '', decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0)
  const ref    = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const dur   = 1800
    const frame = (now: number) => {
      const p = Math.min((now - start) / dur, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setCount(parseFloat((e * to).toFixed(decimals)))
      if (p < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [inView, to, decimals])

  return <span ref={ref}>{decimals > 0 ? count.toFixed(decimals) : count.toLocaleString('pt-PT')}{suffix}</span>
}

const STATS = [
  { to: 287,   suffix: '+',  decimals: 0, label: 'Opiniões Google',     sub: 'e a crescer' },
  { to: 4.7,   suffix: '★',  decimals: 1, label: 'Avaliação',           sub: 'em 5 estrelas' },
  { to: 5,     suffix: '€',  decimals: 0, label: 'A partir de',         sub: 'por pessoa' },
  { to: 7,     suffix: '',   decimals: 0, label: 'Dias por semana',      sub: 'sem fechar à tarde' },
]

export default function Stats() {
  return (
    <section className="py-24 bg-[#00a651]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#009044]">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-[#00a651] p-10 lg:p-12 text-center"
            >
              <div className="font-serif font-bold text-white mb-2"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                <Counter to={s.to} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div className="font-sans text-white/90 text-sm tracking-wide mb-1">{s.label}</div>
              <div className="font-sans text-white/60 text-xs tracking-widest uppercase">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
