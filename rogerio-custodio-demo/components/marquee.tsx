'use client'

import { motion } from 'framer-motion'

const ITEMS = [
  'Cozinhas por medida',
  'Roupeiros & Closets',
  'Mobiliário personalizado',
  'Carpintaria de interiores',
  'Projetos comerciais',
  'Restauro & soluções especiais',
  'MDF hidrófugo',
  'Folheados naturais',
  'Lacados premium',
  'Ferragens Blum / Hettich',
]

export default function Marquee() {
  return (
    <section className="relative bg-rc-charcoal text-white/85 border-y border-white/10 overflow-hidden">
      <div className="absolute inset-0 wood-grain opacity-[0.10] mix-blend-overlay pointer-events-none" />
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
        className="flex whitespace-nowrap py-5 md:py-7 will-change-transform"
      >
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className="font-display italic text-2xl md:text-4xl text-white/85 px-6 md:px-10" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 70' }}>
              {item}
            </span>
            <span className="text-rc-goldLight text-xl" aria-hidden="true">✦</span>
          </span>
        ))}
      </motion.div>
    </section>
  )
}
