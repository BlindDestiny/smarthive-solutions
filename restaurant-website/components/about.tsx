'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function About() {
  return (
    <section id="about" className="py-32 lg:py-44 bg-[#080808] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Section label */}
        <motion.div {...fade()} className="flex items-center gap-4 mb-20">
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold">01</span>
          <span className="w-12 h-px bg-gold/40" />
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-white/30">Nossa História</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Text */}
          <div>
            <motion.h2 {...fade(0.1)}
              className="font-serif font-light text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-8">
              Uma experiência<br />
              <span className="text-gold italic">inesquecível</span><br />
              em Lisboa
            </motion.h2>

            <motion.div {...fade(0.2)} className="w-12 h-px bg-gold/60 mb-8" />

            <motion.p {...fade(0.25)}
              className="font-sans text-white/50 text-base leading-relaxed mb-6">
              Fundado em 2018 pelo Chef Miguel Santos, The Venue nasceu da vontade de criar um espaço onde a gastronomia portuguesa encontra técnicas contemporâneas, num ambiente de requinte e sofisticação.
            </motion.p>

            <motion.p {...fade(0.3)}
              className="font-sans text-white/50 text-base leading-relaxed mb-10">
              Cada prato é uma narrativa — ingredientes sazonais da região, harmonizados com uma carta de vinhos cuidadosamente selecionada pelo nosso Sommelier.
            </motion.p>

            <motion.div {...fade(0.35)} className="flex items-center gap-8">
              <div>
                <div className="font-serif text-4xl text-gold font-light">6</div>
                <div className="font-sans text-[11px] tracking-widest text-white/30 uppercase mt-1">Anos</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div>
                <div className="font-serif text-4xl text-gold font-light">3</div>
                <div className="font-sans text-[11px] tracking-widest text-white/30 uppercase mt-1">Prémios</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div>
                <div className="font-serif text-4xl text-gold font-light">4.9</div>
                <div className="font-sans text-[11px] tracking-widest text-white/30 uppercase mt-1">Google</div>
              </div>
            </motion.div>
          </div>

          {/* Image stack */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Main image */}
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="https://picsum.photos/seed/venue-about/800/1000"
                alt="The Venue interior"
                fill className="object-cover grayscale-[30%] brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-[#0f0f0f] border border-white/10 p-6 backdrop-blur-sm"
            >
              <div className="font-serif text-3xl text-gold font-light">"</div>
              <p className="font-sans text-white/70 text-sm leading-relaxed mt-1 max-w-[180px]">
                Melhor restaurante de Lisboa 2023
              </p>
              <p className="font-sans text-gold/60 text-[10px] tracking-widest uppercase mt-2">Time Out Lisboa</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
