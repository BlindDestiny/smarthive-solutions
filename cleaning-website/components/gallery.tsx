'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

const IMGS = [
  { url:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop', label:'Cozinha',  col:'col-span-2', aspect:'aspect-[16/9]' },
  { url:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80&auto=format&fit=crop', label:'Sala',     col:'col-span-1', aspect:'aspect-square' },
  { url:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop', label:'Quarto',   col:'col-span-1', aspect:'aspect-square' },
  { url:'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80&auto=format&fit=crop', label:'Casa de banho', col:'col-span-1', aspect:'aspect-square' },
  { url:'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80&auto=format&fit=crop', label:'Escritório', col:'col-span-2', aspect:'aspect-[16/9]' },
]

export default function Gallery() {
  return (
    <section id="gallery" className="py-32 bg-[#06090f]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-end justify-between mb-16">
          <div>
            <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-3 py-1.5 mb-5"
            >
              <span className="font-sans text-sky-300 text-xs tracking-wide">O nosso trabalho</span>
            </motion.div>
            <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ duration:0.7 }}
              className="font-display font-extrabold text-white" style={{ fontSize:'clamp(2rem,4vw,3rem)' }}>
              Resultados que<br/>
              <span className="gradient-text">falam por si</span>
            </motion.h2>
          </div>
          <motion.a href="#contact" initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            className="hidden lg:flex items-center gap-2 font-sans text-sky-400 hover:text-sky-300 text-sm transition-colors group">
            Ver todos os casos
            <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"/>
          </motion.a>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {IMGS.map((img,i) => (
            <motion.div key={i}
              initial={{ opacity:0, scale:0.96 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
              transition={{ duration:0.6, delay:i*0.08 }}
              className={`group relative overflow-hidden rounded-3xl ${img.aspect} ${img.col}`}
            >
              <Image src={img.url} alt={img.label} fill
                className="object-cover brightness-75 group-hover:scale-105 group-hover:brightness-90 transition-all duration-700"/>
              <div className="absolute inset-0 bg-gradient-to-t from-[#06090f]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 text-white font-display font-bold text-sm">
                  ✨ {img.label} limpa
                </span>
              </div>
              {/* Cyan corner accent */}
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-sky-500/0 group-hover:bg-sky-500/20 border border-sky-500/0 group-hover:border-sky-500/40 flex items-center justify-center transition-all duration-500">
                <ArrowUpRight className="w-3 h-3 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
