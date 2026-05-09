'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, MapPin } from 'lucide-react'

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y       = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden bg-[#060c05]">

      {/* Background — Brazilian flag colour orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 700, height: 700,
            background: 'radial-gradient(circle, rgba(0,166,81,0.10) 0%, transparent 65%)',
            top: '45%', left: '50%', x: '-50%', y: '-50%',
          }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(255,215,0,0.06) 0%, transparent 70%)',
            top: '20%', right: '10%',
          }}
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 300, height: 300,
            background: 'radial-gradient(circle, rgba(0,166,81,0.05) 0%, transparent 70%)',
            bottom: '20%', left: '10%',
          }}
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
        {/* Subtle diagonal lines */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'repeating-linear-gradient(135deg, rgba(0,166,81,1) 0px, rgba(0,166,81,1) 1px, transparent 1px, transparent 60px)',
          }}
        />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-6 max-w-4xl mx-auto">

        {/* Brazilian flag strip */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-1 w-32 mx-auto mb-8 overflow-hidden"
        >
          <div className="flex-1 bg-[#009c3b]" />
          <div className="flex-1 bg-[#FFD700]" />
          <div className="flex-1 bg-[#002776]" />
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-sans text-[10px] tracking-[0.45em] uppercase text-[#00a651] mb-6"
        >
          🇧🇷 Restaurante Brasileiro · Porto
        </motion.p>

        {/* Title */}
        <div className="overflow-hidden mb-2">
          {['Porto dos', 'Ribeiros'].map((line, li) => (
            <div key={li} className="overflow-hidden">
              <motion.div
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.5 + li * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif font-bold text-white leading-tight"
                style={{ fontSize: li === 1 ? 'clamp(4rem, 14vw, 11rem)' : 'clamp(2rem, 7vw, 5.5rem)' }}
              >
                {li === 1 ? (
                  <span>
                    <span className="text-[#00a651]">R</span>ibeiros
                  </span>
                ) : line}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.95 }}
          className="font-sans text-white/40 text-base md:text-lg tracking-[0.2em] uppercase mb-3"
        >
          Comida Brasileira Autêntica
        </motion.p>

        {/* Rating */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex items-center justify-center gap-2 mb-10"
        >
          <span className="text-[#FFD700] text-sm tracking-wider">★★★★★</span>
          <span className="font-sans text-white/50 text-sm">4.7 · 287 opiniões Google</span>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#menu"
            className="group relative overflow-hidden bg-[#00a651] hover:bg-[#00a651] text-white font-sans text-[11px] tracking-[0.25em] uppercase px-10 py-4 transition-all duration-300 min-w-[180px] text-center">
            <span className="absolute inset-0 bg-[#00c060] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            <span className="relative">Ver o Menu</span>
          </a>
          <a href="https://wa.me/351963349411" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 border border-white/20 hover:border-[#25d366] text-white/60 hover:text-[#25d366] font-sans text-[11px] tracking-[0.25em] uppercase px-8 py-4 transition-all duration-300">
            💬 WhatsApp
          </a>
        </motion.div>

        {/* Address */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="flex items-center justify-center gap-2 mt-8 text-white/25"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span className="font-sans text-xs tracking-wide">Rua da Constituição 982, Porto</span>
        </motion.div>
      </motion.div>

      {/* Scroll */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ChevronDown className="w-4 h-4 text-white/20" />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0a0f08] to-transparent pointer-events-none" />
    </section>
  )
}
