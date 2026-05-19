'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { faqs } from '@/lib/content'

const EASE = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, margin: '-80px' }

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="section bg-rc-surface">
      <div className="container-rc">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="lg:col-span-4"
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
                  visible: { scaleX: 1, transition: { duration: 1, ease: EASE } },
                }}
                style={{ transformOrigin: 'left' }}
                className="rule"
              />
              <span className="eyebrow">Dúvidas frequentes</span>
            </motion.div>
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 28 },
                visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE } },
              }}
              className="font-display text-4xl md:text-5xl text-rc-ink leading-[1.05]"
            >
              Antes de
              <span className="block italic text-rc-gold">avançarmos.</span>
            </motion.h2>
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
              }}
              className="mt-6 text-rc-body leading-relaxed"
            >
              Reunimos as perguntas que mais ouvimos antes de cada projeto. Se a sua não
              está aqui, fale connosco — respondemos dentro de 24 horas úteis.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
            className="lg:col-span-7 lg:col-start-6"
          >
            <div className="border border-rc-line">
              {faqs.map((faq, i) => {
                const isOpen = openIndex === i
                return (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
                    }}
                    className={`${i === faqs.length - 1 ? '' : 'border-b border-rc-line'}`}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="w-full flex items-start justify-between gap-6 p-7 md:p-9 text-left group transition-colors hover:bg-rc-panel/40"
                      aria-expanded={isOpen}
                    >
                      <span className={`font-display text-lg md:text-xl leading-tight transition-colors ${
                        isOpen ? 'text-rc-gold' : 'text-rc-ink group-hover:text-rc-walnut'
                      }`}>
                        {faq.q}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className={`shrink-0 w-10 h-10 border flex items-center justify-center transition-colors ${
                          isOpen ? 'border-rc-gold text-rc-gold' : 'border-rc-line text-rc-muted'
                        }`}
                      >
                        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className="px-7 md:px-9 pb-9 text-rc-body leading-relaxed text-[15px]">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
