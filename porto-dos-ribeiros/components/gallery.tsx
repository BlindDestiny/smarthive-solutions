'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

// Real Unsplash restaurant & food photos
const IMAGES = [
  { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80&auto=format&fit=crop', alt: 'Interior do restaurante',  aspect: 'aspect-[16/9]', col: 'col-span-2' },
  { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80&auto=format&fit=crop', alt: 'Prato principal',           aspect: 'aspect-square',  col: 'col-span-1' },
  { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop', alt: 'Mesa de comida',           aspect: 'aspect-square',  col: 'col-span-1' },
  { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop', alt: 'Jantar romântico',         aspect: 'aspect-[4/5]',   col: 'col-span-1' },
  { url: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80&auto=format&fit=crop', alt: 'Pratos especiais',         aspect: 'aspect-square',  col: 'col-span-1' },
  { url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80&auto=format&fit=crop', alt: 'Comida colorida',          aspect: 'aspect-square',  col: 'col-span-1' },
  { url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80&auto=format&fit=crop', alt: 'Ambiente do restaurante',  aspect: 'aspect-[4/5]',   col: 'col-span-1' },
]

export default function Gallery() {
  return (
    <section id="gallery" className="py-32 lg:py-44 bg-[#0a0f08]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="flex items-center gap-4 mb-6"
        >
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#00a651]">05</span>
          <span className="w-12 h-px bg-[#00a651]/40" />
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-white/30">Galeria</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="font-serif font-bold text-5xl md:text-6xl text-white mb-16"
        >
          O Brasil<br />
          <span className="text-[#00a651]">no Porto</span>
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {IMAGES.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.07 }}
              className={`group relative overflow-hidden ${img.aspect} ${img.col}`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover brightness-70 group-hover:scale-105 group-hover:brightness-80 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-[#00a651]/0 group-hover:bg-[#00a651]/10 transition-colors duration-500" />
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#00a651]/0 group-hover:border-[#00a651]/70 transition-all duration-500" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#00a651]/0 group-hover:border-[#00a651]/70 transition-all duration-500" />
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="font-sans text-white/20 text-sm text-center mt-8"
        >
          Siga-nos no Instagram · @portodosribeiros
        </motion.p>
      </div>
    </section>
  )
}
