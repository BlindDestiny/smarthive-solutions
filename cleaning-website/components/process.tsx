'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MousePointerClick, CalendarCheck, Sparkles, ThumbsUp } from 'lucide-react'

const STEPS = [
  { n:'01', icon:MousePointerClick, title:'Peça online', desc:'Preencha o formulário em 60 segundos. Recebe orçamento imediato por WhatsApp.', color:'#38bdf8' },
  { n:'02', icon:CalendarCheck,     title:'Marque o dia', desc:'Escolha o horário que prefere. Confirmação automática com lembrete 24h antes.', color:'#818cf8' },
  { n:'03', icon:Sparkles,          title:'Limpamos tudo', desc:'A nossa equipa chega a horas, equipada e certificada. Sem surpresas.', color:'#34d399' },
  { n:'04', icon:ThumbsUp,          title:'Aprove o resultado', desc:'Inspecione o trabalho. Se não estiver 100% satisfeito, repetimos de graça.', color:'#f472b6' },
]

export default function Process() {
  const ref = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-100px' })

  return (
    <section id="process" className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="text-center mb-20">
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            className="inline-flex items-center gap-2 bg-[#06090f] border border-sky-500/20 rounded-full px-4 py-2 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400"/>
            <span className="font-sans text-sky-300 text-xs tracking-wide">Simples assim</span>
          </motion.div>
          <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.7 }}
            className="font-display font-extrabold text-[#06090f] mb-4" style={{ fontSize:'clamp(2rem,3.5vw,2.8rem)' }}>
            Pronto em 4 passos
          </motion.h2>
          <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            transition={{ delay:0.2 }}
            className="font-sans text-[#06090f]/50 text-base max-w-sm mx-auto">
            Do pedido ao espaço limpo — sem complicações, sem surpresas.
          </motion.p>
        </div>

        {/* Steps */}
        <div ref={ref} className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-[52px] left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px bg-gray-100">
            <motion.div
              className="h-full bg-gradient-to-r from-sky-400 via-violet-400 to-pink-400"
              initial={{ scaleX:0 }} animate={inView ? { scaleX:1 } : { scaleX:0 }}
              transition={{ duration:1.2, delay:0.5, ease:'easeInOut' }}
              style={{ transformOrigin:'left' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {STEPS.map((step, i) => (
              <motion.div key={step.n}
                initial={{ opacity:0, y:32 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ duration:0.6, delay:i*0.12, ease:[0.22,1,0.36,1] }}
                className="group text-center relative"
              >
                {/* Icon circle */}
                <div className="relative inline-flex mb-6">
                  <motion.div
                    whileHover={{ scale:1.1 }} transition={{ type:'spring', stiffness:400, damping:20 }}
                    className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center relative z-10 shadow-lg"
                    style={{ background:`${step.color}20`, border:`2px solid ${step.color}40` }}
                  >
                    <step.icon className="w-5 h-5" style={{ color:step.color }}/>
                  </motion.div>
                  {/* Number badge */}
                  <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#06090f] border border-gray-100 flex items-center justify-center">
                    <span className="font-display font-bold text-[9px]" style={{ color:step.color }}>{i+1}</span>
                  </div>
                </div>

                <h3 className="font-display font-bold text-[#06090f] text-lg mb-2">{step.title}</h3>
                <p className="font-sans text-[#06090f]/45 text-sm leading-relaxed max-w-[180px] mx-auto">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ delay:0.4 }}
          className="text-center mt-16"
        >
          <a href="#contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-display font-bold px-8 py-4 rounded-2xl hover:shadow-xl hover:shadow-sky-500/30 hover:scale-105 transition-all duration-300">
            Começar agora — é grátis
          </a>
        </motion.div>
      </div>
    </section>
  )
}
