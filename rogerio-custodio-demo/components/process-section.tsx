'use client'

import { motion } from 'framer-motion'
import { processSteps } from '@/lib/content'

const EASE = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, margin: '-80px' }

export default function ProcessSection() {
  return (
    <section className="section bg-rc-ink text-white relative overflow-hidden">
      <div className="absolute inset-0 wood-grain opacity-[0.15]" />
      <div className="container-rc relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="max-w-3xl mb-20"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
            }}
            className="flex items-center gap-3 mb-5"
          >
            <motion.span
              variants={{
                hidden: { scaleX: 0 },
                visible: { scaleX: 1, transition: { duration: 1.1, ease: EASE } },
              }}
              style={{ transformOrigin: 'left' }}
              className="rule-light"
            />
            <span className="eyebrow-light">Metodologia</span>
          </motion.div>
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 28 },
              visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE } },
            }}
            className="font-display text-4xl md:text-5xl leading-[1.05]"
          >
            Cinco passos.
            <span className="italic text-rc-goldLight"> Zero surpresas.</span>
          </motion.h2>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
            }}
            className="mt-6 text-white/70 leading-relaxed max-w-2xl"
          >
            Trabalhamos sempre com o mesmo processo — porque é o que garante que o resultado
            final é exatamente o que o cliente imaginou no início (e idealmente melhor).
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px bg-white/8 border border-white/8"
        >
          {processSteps.map((step, i) => (
            <motion.div
              key={step.number}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
              }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="bg-rc-ink p-8 lg:p-10 relative group"
            >
              {i < processSteps.length - 1 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={viewport}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.2 + i * 0.12 }}
                  className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10"
                >
                  <span className="block w-3 h-3 rotate-45 border-t border-r border-rc-gold/60" />
                </motion.span>
              )}
              <motion.div
                className="font-display text-5xl italic text-rc-gold/70 group-hover:text-rc-goldLight transition-colors duration-500"
              >
                {step.number}
              </motion.div>
              <h3 className="font-display text-2xl text-white mt-4 leading-tight">{step.title}</h3>
              <p className="text-sm text-white/65 mt-3 leading-relaxed">{step.body}</p>
              <div className="mt-6 inline-block px-3 py-1.5 bg-white/5 text-[10px] uppercase tracking-widest2 text-rc-goldLight">
                {step.duration}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
