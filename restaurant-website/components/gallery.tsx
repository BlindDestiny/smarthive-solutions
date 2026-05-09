'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

const IMAGES = [
  { seed: 'venue-g1', aspect: 'aspect-square',    col: 'col-span-1' },
  { seed: 'venue-g2', aspect: 'aspect-[4/5]',     col: 'col-span-1' },
  { seed: 'venue-g3', aspect: 'aspect-[16/9]',    col: 'col-span-2' },
  { seed: 'venue-g4', aspect: 'aspect-square',    col: 'col-span-1' },
  { seed: 'venue-g5', aspect: 'aspect-[3/4]',     col: 'col-span-1' },
  { seed: 'venue-g6', aspect: 'aspect-square',    col: 'col-span-1' },
  { seed: 'venue-g7', aspect: 'aspect-[2/3]',     col: 'col-span-1' },
]

export default function Gallery() {
  return (
    <section id="gallery" className="py-32 lg:py-44 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="flex items-center gap-4 mb-6"
        >
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold">05</span>
          <span className="w-12 h-px bg-gold/40" />
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-white/30">Galeria</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="font-serif font-light text-5xl md:text-6xl text-white mb-16"
        >
          Momentos<br />
          <span className="text-gold italic">inesquecíveis</span>
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {IMAGES.map((img, i) => (
            <motion.div
              key={img.seed}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className={`group relative overflow-hidden ${img.aspect} ${img.col}`}
            >
              <Image
                src={`https://picsum.photos/seed/${img.seed}/800/800`}
                alt="The Venue"
                fill
                className="object-cover grayscale-[20%] brightness-75 group-hover:scale-105 group-hover:brightness-90 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
              {/* Gold corner accent */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-gold/0 group-hover:border-gold/60 transition-all duration-500" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-gold/0 group-hover:border-gold/60 transition-all duration-500" />
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="font-sans text-white/20 text-sm text-center mt-8"
        >
          @thevenue_lisboa · Partilhe os seus momentos connosco
        </motion.p>
      </div>
    </section>
  )
}
