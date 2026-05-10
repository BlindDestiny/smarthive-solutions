'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

const PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=700&q=85&auto=format&fit=crop', alt: 'Signature cocktail', span: 'col-span-1 row-span-2' },
  { url: 'https://images.unsplash.com/photo-1551024709-8f23befc548b?w=700&q=85&auto=format&fit=crop', alt: 'Cave bar', span: 'col-span-1' },
  { url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&q=85&auto=format&fit=crop', alt: 'Dark lounge interior', span: 'col-span-1' },
  { url: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=700&q=85&auto=format&fit=crop', alt: 'Evening crowd', span: 'col-span-1 row-span-2' },
  { url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=700&q=85&auto=format&fit=crop', alt: 'Premium spirits', span: 'col-span-1' },
  { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=85&auto=format&fit=crop', alt: 'Candlelight ambiance', span: 'col-span-1' },
]

export default function Gallery() {
  return (
    <section id="gallery" className="py-28 bg-cave-bg">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="text-center mb-16">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-display text-[10px] tracking-[0.4em] text-[#e84800] uppercase block mb-4">
            The Experience
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display font-bold text-cave-text" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
            Life in the Cave
          </motion.h2>
          <div className="mt-4 mx-auto w-16 h-px bg-[#e84800]" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-3 gap-3 h-[600px] md:h-[700px]">
          {PHOTOS.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative overflow-hidden rounded-sm group ${p.span}`}
            >
              <Image src={p.url} alt={p.alt} fill
                className="object-cover group-hover:scale-[1.06] transition-transform duration-700" />
              <div className="absolute inset-0 bg-[#080808]/20 group-hover:bg-[rgba(232,72,0,0.08)] transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
