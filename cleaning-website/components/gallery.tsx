'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

// Row 1: cleaners at work. Row 2: the clean results.
const ROW1 = [
  { url:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85&auto=format&fit=crop', label:'Limpeza residencial', col:'col-span-2', aspect:'aspect-[16/9]' },
  { url:'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=85&auto=format&fit=crop', label:'Equipa certificada',   col:'col-span-1', aspect:'aspect-square' },
  { url:'https://images.unsplash.com/photo-1527515637462-cff94ead201b?w=600&q=85&auto=format&fit=crop', label:'Produtos eco-friendly',col:'col-span-1', aspect:'aspect-square' },
]

const ROW2 = [
  { url:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=85&auto=format&fit=crop', label:'Cozinha reluzente',   col:'col-span-1', aspect:'aspect-square' },
  { url:'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=85&auto=format&fit=crop', label:'Casa de banho',      col:'col-span-1', aspect:'aspect-square' },
  { url:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=85&auto=format&fit=crop', label:'Espaço transformado', col:'col-span-2', aspect:'aspect-[16/9]' },
]

function ImgCard({ img, i, delay }: { img: typeof ROW1[0]; i: number; delay: number }) {
  return (
    <motion.div
      initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
      transition={{ duration:0.55, delay, ease:[0.22,1,0.36,1] }}
      className={`group relative overflow-hidden rounded-2xl ${img.aspect} ${img.col}`}
    >
      <Image src={img.url} alt={img.label} fill
        className="object-cover brightness-[0.72] group-hover:scale-[1.04] group-hover:brightness-[0.85] transition-all duration-700"
      />
      {/* Permanent subtle label */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-8 pb-4 px-4">
        <span className="font-sans text-white/80 text-xs tracking-wide">{img.label}</span>
      </div>
      {/* Cyan corner on hover */}
      <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-sky-400/0 group-hover:border-sky-400/70 transition-all duration-500 rounded-tl-sm" />
    </motion.div>
  )
}

export default function Gallery() {
  return (
    <section id="gallery" className="py-32 bg-[#06090f]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6">
          <div>
            <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-3 py-1.5 mb-5"
            >
              <span className="font-sans text-sky-300 text-xs tracking-wide">O nosso trabalho</span>
            </motion.div>
            <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ duration:0.7 }}
              className="font-display font-extrabold text-white" style={{ fontSize:'clamp(2rem,3.5vw,2.8rem)' }}>
              Em acção.<br/>
              <span className="gradient-text">Resultados reais.</span>
            </motion.h2>
          </div>
          <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            className="font-sans text-white/35 text-sm max-w-xs leading-relaxed">
            Cada trabalho é documentado. Equipas profissionais, resultados que falam por si.
          </motion.p>
        </div>

        {/* Row label */}
        <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
          className="flex items-center gap-3 mb-4">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-sky-400">Processo</span>
          <span className="flex-1 h-px bg-sky-500/10" />
        </motion.div>

        <div className="grid grid-cols-4 gap-3 mb-3">
          {ROW1.map((img,i) => <ImgCard key={i} img={img} i={i} delay={i*0.07}/>)}
        </div>

        {/* Row label */}
        <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
          className="flex items-center gap-3 mb-4 mt-3">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-emerald-400">Resultado</span>
          <span className="flex-1 h-px bg-emerald-500/10" />
        </motion.div>

        <div className="grid grid-cols-4 gap-3">
          {ROW2.map((img,i) => <ImgCard key={i} img={img} i={i} delay={i*0.07}/>)}
        </div>
      </div>
    </section>
  )
}
