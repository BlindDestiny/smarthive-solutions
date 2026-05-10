'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=1800&q=85&auto=format&fit=crop"
          alt="Cave Lounge interior"
          fill className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/60 via-[#080808]/30 to-[#080808]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/70 via-transparent to-[#080808]/70" />
        {/* Orange fire glow from bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/3 bg-[#e84800]/10 blur-[80px]" />
      </motion.div>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="font-display text-[10px] tracking-[0.5em] text-[#e84800] uppercase">
            Underground Bar & Lounge
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-bold text-cave-text mb-6 leading-tight"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
        >
          Enter<br/>
          <span className="text-[#e84800] glow-text">The Cave</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-sans text-cave-muted text-lg leading-relaxed max-w-xl mx-auto mb-10"
        >
          Where the night comes alive. Signature cocktails, underground beats
          and an atmosphere unlike anywhere else.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#reservation"
            className="bg-[#e84800] hover:bg-[#ff5500] text-white font-display text-xs tracking-[0.2em] uppercase px-8 py-4 transition-all duration-300 shadow-lg shadow-[rgba(232,72,0,0.3)] animate-glow-pulse">
            Reserve Your Table
          </a>
          <a href="#menu"
            className="border border-[rgba(232,72,0,0.4)] text-cave-text font-display text-xs tracking-[0.2em] uppercase px-8 py-4 hover:border-[#e84800] hover:text-[#ff6a00] transition-all duration-300">
            View the Menu
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-display text-[9px] tracking-[0.4em] text-cave-muted/50 uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 text-[#e84800]/50 animate-bounce" />
      </motion.div>
    </section>
  )
}
