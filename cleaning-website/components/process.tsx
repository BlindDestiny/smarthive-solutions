'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MousePointerClick, CalendarCheck, Sparkles, ThumbsUp } from 'lucide-react'

const STEPS = [
  { n:'01', icon:MousePointerClick, title:'Peça online', desc:'60 segundos. Orçamento imediato no WhatsApp.', color:'#0284c7' },
  { n:'02', icon:CalendarCheck,     title:'Marque o dia', desc:'Escolha a hora. Confirmação automática.', color:'#0284c7' },
  { n:'03', icon:Sparkles,          title:'Limpamos tudo', desc:'Equipa pontual, equipada e certificada.', color:'#0284c7' },
  { n:'04', icon:ThumbsUp,          title:'Aprovação total', desc:'Não ficou? Repetimos — sem custo.', color:'#0284c7' },
]

export default function Process() {
  const ref = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-100px' })

  return (
    <section id="process" className="py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="text-center mb-20">
          <motion.span initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            className="inline-block badge-light text-sky-700 font-sans text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            Simples assim
          </motion.span>
          <motion.h2 initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.65 }}
            className="font-display font-extrabold text-slate-900 mb-3" style={{ fontSize:'clamp(1.9rem,3.5vw,2.8rem)' }}>
            Pronto em 4 passos
          </motion.h2>
          <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            transition={{ delay:0.15 }}
            className="font-sans text-slate-400 text-base max-w-sm mx-auto">
            Do pedido ao espaço limpo, sem complicações.
          </motion.p>
        </div>

        <div ref={ref} className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-[26px] left-[calc(12.5%+26px)] right-[calc(12.5%+26px)] h-px bg-slate-200">
            <motion.div
              className="h-full bg-sky-400"
              initial={{ scaleX:0 }} animate={inView ? { scaleX:1 } : {}}
              transition={{ duration:1.4, delay:0.4, ease:'easeInOut' }}
              style={{ transformOrigin:'left' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
            {STEPS.map((step, i) => (
              <motion.div key={step.n}
                initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ duration:0.6, delay:i*0.1, ease:[0.22,1,0.36,1] }}
                className="group text-center"
              >
                <motion.div whileHover={{ scale:1.08 }} transition={{ type:'spring', stiffness:400, damping:20 }}
                  className="w-[52px] h-[52px] rounded-2xl bg-sky-600 flex items-center justify-center mx-auto mb-6 shadow-md shadow-sky-600/20 relative z-10">
                  <step.icon className="w-5 h-5 text-white"/>
                </motion.div>
                <h3 className="font-display font-bold text-slate-900 text-lg mb-2">{step.title}</h3>
                <p className="font-sans text-slate-400 text-sm leading-relaxed max-w-[170px] mx-auto">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity:0, y:14 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ delay:0.3 }} className="text-center mt-16">
          <a href="#contact"
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-display font-bold px-8 py-4 rounded-2xl transition-colors shadow-md shadow-sky-600/20">
            Começar agora — é grátis
          </a>
        </motion.div>
      </div>
    </section>
  )
}
