'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function About() {
  return (
    <section id="about" className="py-32 lg:py-44 bg-[#0a0f08] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <motion.div {...fade()} className="flex items-center gap-4 mb-20">
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#00a651]">01</span>
          <span className="w-12 h-px bg-[#00a651]/40" />
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-white/30">A Nossa História</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="https://picsum.photos/seed/ribeiros-about/800/1000"
                alt="Porto dos Ribeiros"
                fill className="object-cover brightness-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f08]/80 via-transparent to-transparent" />
              {/* Green accent border */}
              <div className="absolute inset-0 border border-[#00a651]/10" />
            </div>

            {/* Floating stat */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -bottom-5 -right-5 bg-[#00a651] p-6 text-center shadow-xl"
            >
              <div className="font-serif text-4xl font-bold text-white">4.7</div>
              <div className="font-sans text-[10px] tracking-widest text-white/80 uppercase mt-1">★ Google</div>
              <div className="font-sans text-[10px] text-white/60 mt-0.5">287 opiniões</div>
            </motion.div>
          </motion.div>

          {/* Text */}
          <div className="order-1 lg:order-2">
            <motion.h2 {...fade(0.1)}
              className="font-serif font-bold text-5xl md:text-6xl text-white leading-tight mb-8">
              Sabores do Brasil<br />
              <span className="text-[#00a651]">no coração</span><br />
              do Porto
            </motion.h2>

            <motion.div {...fade(0.2)} className="w-12 h-1 bg-[#FFD700] mb-8" />

            <motion.p {...fade(0.25)}
              className="font-sans text-white/55 text-base leading-relaxed mb-5">
              Somos um restaurante familiar com a alma do Brasil. Cada prato que sai da nossa cozinha carrega a tradição, o calor e os sabores autênticos da culinária brasileira — desde a feijoada que aquece a alma até à picanha que conquista de imediato.
            </motion.p>

            <motion.p {...fade(0.3)}
              className="font-sans text-white/55 text-base leading-relaxed mb-10">
              Estamos na Rua da Constituição desde o primeiro dia, e fizemos do Porto a nossa segunda casa. Aqui não há apenas clientes — há família.
            </motion.p>

            {/* Highlights */}
            <motion.div {...fade(0.35)} className="grid grid-cols-2 gap-4">
              {[
                { icon: '🍛', label: 'Feijoada todos os dias' },
                { icon: '🥩', label: 'Picanha fresca' },
                { icon: '🌿', label: 'Opções vegetarianas' },
                { icon: '☀️', label: 'Esplanada disponível' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] px-4 py-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-sans text-white/60 text-sm">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
