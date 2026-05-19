'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { testimonials } from '@/lib/content'

const EASE = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, margin: '-80px' }

export default function Testimonials() {
  return (
    <section className="section bg-rc-bg">
      <div className="container-rc">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="max-w-2xl mx-auto text-center mb-20"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
            }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <motion.span
              variants={{
                hidden: { scaleX: 0 },
                visible: { scaleX: 1, transition: { duration: 1, ease: EASE } },
              }}
              className="rule"
            />
            <span className="eyebrow">Testemunhos</span>
            <motion.span
              variants={{
                hidden: { scaleX: 0 },
                visible: { scaleX: 1, transition: { duration: 1, ease: EASE } },
              }}
              className="rule"
            />
          </motion.div>
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 28 },
              visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE } },
            }}
            className="font-display text-4xl md:text-5xl text-rc-ink leading-[1.05]"
          >
            O que dizem
            <span className="italic text-rc-gold"> os nossos clientes.</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((t, i) => (
            <motion.article
              key={i}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
              }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="bg-rc-surface border border-rc-line p-10 flex flex-col"
            >
              <motion.div
                initial={{ opacity: 0, rotate: -8 }}
                whileInView={{ opacity: 1, rotate: 0 }}
                viewport={viewport}
                transition={{ duration: 0.9, ease: EASE, delay: 0.2 + i * 0.1 }}
              >
                <Quote size={32} className="text-rc-gold mb-8" strokeWidth={1} />
              </motion.div>
              <p className="text-rc-body text-[15px] leading-relaxed italic flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-10 pt-6 border-t border-rc-line">
                <div className="font-display text-lg text-rc-ink">{t.name}</div>
                <div className="text-[11px] uppercase tracking-widest2 text-rc-gold mt-1">{t.role}</div>
                <div className="text-xs text-rc-muted mt-2">{t.project} · {t.location}</div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
