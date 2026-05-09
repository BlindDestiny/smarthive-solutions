'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

const ROW1 = [
  { url:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85&auto=format&fit=crop', label:'Limpeza residencial', col:'col-span-2', aspect:'aspect-[16/9]' },
  { url:'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=85&auto=format&fit=crop', label:'Equipa profissional',  col:'col-span-1', aspect:'aspect-square' },
  { url:'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=85&auto=format&fit=crop', label:'Produtos eco',         col:'col-span-1', aspect:'aspect-square' },
]

const ROW2 = [
  { url:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=85&auto=format&fit=crop', label:'Cozinha',             col:'col-span-1', aspect:'aspect-square' },
  { url:'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=85&auto=format&fit=crop', label:'Casa de banho',      col:'col-span-1', aspect:'aspect-square' },
  { url:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=85&auto=format&fit=crop', label:'Espaço transformado',col:'col-span-2', aspect:'aspect-[16/9]' },
]

function Img({ img, delay }: { img:typeof ROW1[0]; delay:number }) {
  return (
    <motion.div
      initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
      transition={{ duration:0.5, delay, ease:[0.22,1,0.36,1] }}
      className={`group relative overflow-hidden rounded-2xl ${img.aspect} ${img.col}`}
    >
      <Image src={img.url} alt={img.label} fill
        className="object-cover group-hover:scale-[1.04] transition-transform duration-600"/>
      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors duration-500"/>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/60 to-transparent py-4 px-4">
        <span className="font-sans text-white/90 text-xs">{img.label}</span>
      </div>
    </motion.div>
  )
}

export default function Gallery() {
  return (
    <section id="gallery" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="flex items-end justify-between mb-14">
          <div>
            <motion.span initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              className="inline-block badge-light text-sky-700 font-sans text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              O nosso trabalho
            </motion.span>
            <motion.h2 initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ duration:0.65 }}
              className="font-display font-extrabold text-slate-900" style={{ fontSize:'clamp(1.9rem,3.5vw,2.8rem)' }}>
              Em acção.<br/><span className="text-sky-600">Resultados reais.</span>
            </motion.h2>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-sky-500 font-semibold">Processo</span>
          <span className="flex-1 h-px bg-slate-100"/>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-3">
          {ROW1.map((img,i) => <Img key={i} img={img} delay={i*0.07}/>)}
        </div>

        <div className="flex items-center gap-3 mb-4 mt-2">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-slate-400 font-semibold">Resultado</span>
          <span className="flex-1 h-px bg-slate-100"/>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {ROW2.map((img,i) => <Img key={i} img={img} delay={i*0.07}/>)}
        </div>
      </div>
    </section>
  )
}
