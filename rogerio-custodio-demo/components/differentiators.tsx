'use client'

import { motion } from 'framer-motion'
import { differentiators } from '@/lib/content'

const EASE = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, margin: '-80px' }

export default function Differentiators() {
  return (
    <section className="section bg-rc-surface">
      <div className="container-rc">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="max-w-3xl mb-20 text-center mx-auto"
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
            <span className="eyebrow">Porque escolher-nos</span>
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
            O que nos
            <span className="italic text-rc-gold"> distingue.</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
          className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rc-line border border-rc-line"
        >
          {differentiators.map((d) => (
            <motion.div
              key={d.number}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
              }}
              className="bg-rc-surface p-12 md:p-14 group"
            >
              <div className="flex items-start gap-8">
                <motion.div
                  className="font-display text-6xl italic text-rc-gold/30 group-hover:text-rc-gold transition-colors duration-700 shrink-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  {d.number}
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-display text-2xl text-rc-ink leading-tight">{d.title}</h3>
                  <p className="mt-4 text-rc-body leading-relaxed">{d.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
