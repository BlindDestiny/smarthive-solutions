'use client'

import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

export default function PageHero({
  eyebrow,
  title,
  italic,
  description,
}: {
  eyebrow: string
  title: string
  italic?: string
  description?: string
}) {
  return (
    <section className="pt-48 pb-24 md:pb-32 bg-rc-graphite text-white relative overflow-hidden">
      <div className="absolute inset-0 wood-grain opacity-[0.10]" />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.8, ease: EASE, delay: 0.3 }}
        className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-rc-gold/45 to-transparent"
      />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }}
        className="container-rc relative"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
          }}
          className="flex items-center gap-3 mb-8"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.4 }}
            style={{ transformOrigin: 'left' }}
            className="rule-light"
          />
          <span className="eyebrow-light">{eyebrow}</span>
        </motion.div>
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: EASE } },
          }}
          className="font-display text-5xl md:text-7xl leading-[1.02] max-w-4xl"
        >
          {title}
          {italic && (
            <motion.span
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE } },
              }}
              className="block italic text-rc-goldLight"
            >
              {italic}
            </motion.span>
          )}
        </motion.h1>
        {description && (
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
            }}
            className="mt-10 text-white/70 text-lg leading-relaxed max-w-2xl"
          >
            {description}
          </motion.p>
        )}
      </motion.div>
    </section>
  )
}
