'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const TITLE = 'THE VENUE'

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y       = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden bg-[#080808]">

      {/* Animated background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 800, height: 800,
            background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 65%)',
            top: '50%', left: '50%', x: '-50%', y: '-50%',
          }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 350, height: 350,
            background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)',
            top: '25%', left: '15%',
          }}
          animate={{ x: [0, 60, -20, 0], y: [0, -40, 20, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 250, height: 250,
            background: 'radial-gradient(circle, rgba(212,175,55,0.03) 0%, transparent 70%)',
            bottom: '20%', right: '15%',
          }}
          animate={{ x: [0, -40, 20, 0], y: [0, 30, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212,175,55,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Content */}
      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-6">

        {/* Eyebrow line */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 48 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-px bg-gold mx-auto mb-6"
        />

        {/* Eyebrow text */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          animate={{ opacity: 1, letterSpacing: '0.45em' }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="font-sans text-[10px] text-gold uppercase mb-8 tracking-[0.45em]"
        >
          Lisboa · Est. 2018
        </motion.p>

        {/* Main title — character stagger */}
        <div
          aria-label={TITLE}
          className="font-serif font-light leading-none text-white mb-4 overflow-hidden"
          style={{ fontSize: 'clamp(3.5rem, 13vw, 11rem)', letterSpacing: '0.12em' }}
        >
          {TITLE.split('').map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.9,
                delay: 0.5 + i * 0.065,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char === ' ' ? ' ' : char}
            </motion.span>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="font-serif font-light text-white/35 text-xl md:text-2xl tracking-[0.35em] uppercase mb-14"
        >
          Fine Dining · Craft Cocktails · Live Music
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          {/* Primary — fill on hover */}
          <a href="#reservar"
            className="group relative overflow-hidden border border-gold text-gold font-sans text-[11px] tracking-[0.3em] uppercase px-10 py-4 transition-colors duration-500 hover:text-black min-w-[180px] text-center">
            <span className="absolute inset-0 bg-gold -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            <span className="relative">Reservar Mesa</span>
          </a>

          {/* Secondary */}
          <a href="#menu"
            className="flex items-center gap-3 font-sans text-[11px] tracking-[0.3em] uppercase text-white/40 hover:text-white transition-colors duration-300">
            Ver Menu
            <motion.span
              className="block h-px bg-white/40"
              initial={{ width: 24 }}
              whileHover={{ width: 48 }}
              transition={{ duration: 0.3 }}
            />
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-white/20">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ChevronDown className="w-4 h-4 text-white/20" />
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />
    </section>
  )
}
