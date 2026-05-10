'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Flame, Music, Sparkles } from 'lucide-react'

const PILLARS = [
  { Icon: Flame,    title: 'Craft Cocktails',   desc: 'Every drink is a ritual. Our bartenders craft each cocktail with premium spirits and house-made infusions.' },
  { Icon: Music,    title: 'Live Sounds',        desc: 'From jazz on Thursdays to underground electronic on weekends — the music never stops.' },
  { Icon: Sparkles, title: 'The Atmosphere',     desc: 'Carved stone walls, candlelight and the warmth of fire. A world apart from the city above.' },
]

export default function About() {
  return (
    <section id="about" className="py-28 bg-cave-warm relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px divider-fire" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-[#e84800]/5 blur-[60px]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden glow-border">
              <Image
                src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=900&q=85&auto=format&fit=crop"
                alt="Cave Lounge atmosphere"
                fill className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/60 via-transparent to-transparent" />
            </div>
            {/* Floating stat */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-6 -right-6 card-cave rounded-sm p-6 glow-border"
            >
              <div className="font-display font-bold text-[#e84800] text-4xl glow-text">2018</div>
              <div className="font-sans text-cave-muted text-xs tracking-widest uppercase mt-1">Est. in the Underground</div>
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="font-display text-[10px] tracking-[0.4em] text-[#e84800] uppercase mb-4 block">Our Story</span>
            <h2 className="font-display font-bold text-cave-text mb-6 leading-tight"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
              Born from the<br/>
              <span className="text-[#e84800]">depths below</span>
            </h2>
            <p className="font-sans text-cave-muted leading-relaxed mb-5">
              Tucked beneath the city streets, Cave Lounge was born from a passion for
              exceptional drinks and the kind of atmosphere that makes time disappear.
              Raw stone walls, flickering fire and a curated soundtrack set the stage
              for evenings you won't forget.
            </p>
            <p className="font-sans text-cave-muted leading-relaxed mb-10">
              Our team of mixologists draws on global traditions to create cocktails
              that are as beautiful as they are complex. Every detail — from the glassware
              to the garnish — is chosen with obsessive care.
            </p>

            <div className="space-y-5">
              {PILLARS.map(({ Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-[rgba(232,72,0,0.3)] text-[#e84800] mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-display text-cave-text text-sm tracking-wide mb-1">{title}</div>
                    <div className="font-sans text-cave-muted text-sm leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px divider-fire" />
    </section>
  )
}
