'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

function Counter({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const ref  = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    if (!inView) return
    const start    = performance.now()
    const duration = 1800
    const frame = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const ease     = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(ease * to))
      if (progress < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [inView, to])

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString('pt-PT')}{suffix}
    </span>
  )
}

const STATS = [
  { value: 2400, suffix: '+', label: 'Clientes por mês', sub: 'média 2024' },
  { value: 4.9,  suffix: '★', label: 'Avaliação Google', sub: '800+ reviews' },
  { value: 6,    suffix: '',  label: 'Anos de história', sub: 'desde 2018' },
  { value: 98,   suffix: '%', label: 'Taxa de satisfação', sub: 'pesquisa interna' },
]

export default function Stats() {
  return (
    <section className="py-28 bg-[#050505] border-y border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04]">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#050505] p-10 lg:p-14 text-center"
            >
              <div className="font-serif font-light text-gold mb-2"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                <Counter to={typeof s.value === 'number' && s.value % 1 !== 0 ? s.value * 10 : s.value}
                  suffix={s.suffix}
                />
                {/* Handle decimal */}
                {s.value === 4.9 && null}
              </div>
              <div className="font-sans text-white/70 text-sm tracking-wide mb-1">{s.label}</div>
              <div className="font-sans text-white/20 text-xs tracking-widest uppercase">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
