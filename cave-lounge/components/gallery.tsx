'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

const PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=85&auto=format&fit=crop', alt: 'Signature cocktail',   col: 'col-span-1 row-span-2' },
  { url: 'https://images.unsplash.com/photo-1551024709-8f23befc548b?w=700&q=85&auto=format&fit=crop', alt: 'Cave bar',              col: 'col-span-1' },
  { url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&q=85&auto=format&fit=crop', alt: 'Dark lounge interior', col: 'col-span-1' },
  { url: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=700&q=85&auto=format&fit=crop', alt: 'Evening crowd',        col: 'col-span-1 row-span-2' },
  { url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=700&q=85&auto=format&fit=crop', alt: 'Premium spirits',      col: 'col-span-1' },
  { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=85&auto=format&fit=crop', alt: 'Candlelight ambiance',  col: 'col-span-1' },
]

export default function Gallery() {
  return (
    <section id="gallery" className="py-32 bg-[#050505]">
      <div className="max-w-6xl mx-auto px-8 lg:px-16">

        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-display text-[9px] tracking-[0.5em] text-[#e84800] uppercase block mb-5">
            The Experience
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display font-bold text-[#ede8e4]"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
            Life in the Cave
          </motion.h2>
          <div className="mt-5 mx-auto w-12 h-px bg-[#e84800]/50" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-3 gap-3"
          style={{ height: 680 }}>
          {PHOTOS.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`relative overflow-hidden group ${p.col}`}
              style={{ borderRadius: 2 }}
            >
              <Image src={p.url} alt={p.alt} fill
                className="object-cover group-hover:scale-[1.07] transition-transform duration-700 ease-out" />
              <div className="absolute inset-0 bg-[#050505]/15 group-hover:bg-[rgba(232,72,0,0.06)] transition-colors duration-500" />
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="font-display text-[8px] tracking-[0.3em] uppercase text-white/60 glass px-2.5 py-1">
                  {p.alt}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
