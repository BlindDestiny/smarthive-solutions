'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Flame, Music, Sparkles } from 'lucide-react'

const PILLARS = [
  { Icon: Flame,    title: 'Craft Cocktails',  desc: 'Every drink is a ritual. Premium spirits and house-made infusions, crafted with obsessive care.' },
  { Icon: Music,    title: 'Live Sounds',       desc: 'From jazz on Thursdays to underground electronic on weekends — the music never stops.' },
  { Icon: Sparkles, title: 'The Atmosphere',    desc: 'Stone walls, candlelight and the warmth of fire. A world apart from the city above.' },
]

const fade = (delay = 0) => ({
  initial:    { opacity: 0, y: 28 },
  whileInView:{ opacity: 1, y: 0  },
  viewport:   { once: true },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function About() {
  return (
    <section id="about" className="py-32 bg-[#050505] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px divider-fire" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-24 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(232,72,0,0.05), transparent)', filter: 'blur(40px)' }} />

      <div className="max-w-6xl mx-auto px-8 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Image */}
          <motion.div {...fade(0)} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden" style={{ borderRadius: 2, border: '1px solid rgba(255,255,255,0.06)' }}>
              <Image
                src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=900&q=85&auto=format&fit=crop"
                alt="Cave Lounge" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/50 via-transparent to-transparent" />
            </div>
            <motion.div {...fade(0.25)}
              className="absolute -bottom-6 -right-6 glass-strong p-6" style={{ borderRadius: 2 }}>
              <div className="font-display font-bold text-[#e84800] text-4xl glow-text">2018</div>
              <div className="font-display text-[9px] tracking-[0.3em] text-white/35 uppercase mt-1">Est. Underground</div>
            </motion.div>
          </motion.div>

          {/* Text */}
          <div>
            <motion.span {...fade(0.1)}
              className="font-display text-[9px] tracking-[0.5em] text-[#e84800] uppercase block mb-5">
              Our Story
            </motion.span>
            <motion.h2 {...fade(0.18)}
              className="font-display font-bold text-[#ede8e4] mb-8 leading-tight"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
              Born from the<br/><span className="text-[#e84800]">depths below</span>
            </motion.h2>
            <motion.p {...fade(0.26)}
              className="font-sans font-light text-white/50 leading-loose mb-5 text-sm tracking-wide">
              Tucked beneath the city streets, Cave Lounge was born from a passion for
              exceptional drinks and the kind of atmosphere that makes time disappear.
              Raw stone walls, flickering fire and a curated soundtrack — the stage for evenings you won't forget.
            </motion.p>
            <motion.p {...fade(0.32)}
              className="font-sans font-light text-white/50 leading-loose mb-12 text-sm tracking-wide">
              Our mixologists draw on global traditions to create cocktails as beautiful as they are complex.
              Every detail — from the glassware to the garnish — chosen with obsessive care.
            </motion.p>

            <div className="space-y-6">
              {PILLARS.map(({ Icon, title, desc }, i) => (
                <motion.div key={title} {...fade(0.38 + i * 0.1)}
                  className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-[rgba(232,72,0,0.25)] text-[#e84800] mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-display text-[#ede8e4] text-sm tracking-wide mb-1">{title}</div>
                    <div className="font-sans font-light text-white/45 text-sm leading-relaxed">{desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px divider-subtle" />
    </section>
  )
}
