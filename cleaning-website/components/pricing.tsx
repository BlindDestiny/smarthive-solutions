'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Sparkles, ArrowRight, Zap } from 'lucide-react'

const PLANS = [
  {
    name:'Essencial',
    desc:'Para espaços pequenos e limpezas de manutenção.',
    priceOnce:99, priceRecurr:79,
    color:'#38bdf8',
    features:[
      'Cozinha completa','Casas de banho (até 2)','Sala e quartos',
      'Aspiração e lavagem de chão','2–3 horas de trabalho','1 profissional',
    ],
    highlight: false,
  },
  {
    name:'Standard',
    desc:'A escolha mais popular para famílias e apartamentos.',
    priceOnce:149, priceRecurr:119,
    color:'#34d399',
    features:[
      'Tudo do plano Essencial','Arrumação e organização','Janelas interiores',
      'Interior de micro-ondas e frigorífico','4–5 horas de trabalho','2 profissionais',
      'Relatório fotográfico',
    ],
    highlight: true,
  },
  {
    name:'Premium',
    desc:'Limpeza total com atenção a cada detalhe.',
    priceOnce:219, priceRecurr:179,
    color:'#818cf8',
    features:[
      'Tudo do plano Standard','Limpeza de janelas exterior (R/C)','Interior de forno',
      'Armários e prateleiras','Varandas e espaços exteriores','6+ horas de trabalho',
      '2–3 profissionais','Garantia extendida 7 dias',
    ],
    highlight: false,
  },
]

export default function Pricing() {
  const [recurring, setRecurring] = useState(false)

  return (
    <section id="pricing" className="py-32 bg-[#06090f]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="text-center mb-16">
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-3 py-1.5 mb-5"
          >
            <Zap className="w-3 h-3 text-sky-400"/>
            <span className="font-sans text-sky-300 text-xs tracking-wide">Preços transparentes</span>
          </motion.div>
          <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.7 }}
            className="font-display font-extrabold text-white mb-4" style={{ fontSize:'clamp(2rem,4vw,3rem)' }}>
            Escolha o seu plano
          </motion.h2>

          {/* Toggle */}
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            transition={{ delay:0.2 }}
            className="inline-flex items-center gap-4 mt-4"
          >
            <span className={`font-sans text-sm transition-colors ${!recurring?'text-white':'text-white/40'}`}>Única vez</span>
            <button onClick={()=>setRecurring(v=>!v)}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 ${recurring?'bg-gradient-to-r from-sky-500 to-emerald-500':'bg-white/10'}`}>
              <motion.div
                animate={{ x: recurring ? 28 : 4 }}
                transition={{ type:'spring', stiffness:500, damping:30 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
              />
            </button>
            <span className={`font-sans text-sm transition-colors ${recurring?'text-white':'text-white/40'}`}>
              Recorrente
              <span className="ml-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Poupa 20%
              </span>
            </span>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div key={plan.name}
              initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ duration:0.7, delay:i*0.12, ease:[0.22,1,0.36,1] }}
              className={`relative rounded-3xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                plan.highlight
                  ? 'bg-gradient-to-b from-sky-500/15 to-emerald-500/5 border-2 border-sky-500/40 shadow-2xl shadow-sky-500/10'
                  : 'card-glass hover:border-sky-500/15'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-display font-bold text-xs px-4 py-1.5 rounded-full shadow-lg">
                  <Sparkles className="w-3 h-3"/> Mais popular
                </div>
              )}

              <div className="mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background:`${plan.color}18`, border:`1px solid ${plan.color}30` }}>
                  <Sparkles className="w-5 h-5" style={{ color:plan.color }}/>
                </div>
                <h3 className="font-display font-bold text-white text-xl mb-1">{plan.name}</h3>
                <p className="font-sans text-white/40 text-sm">{plan.desc}</p>
              </div>

              {/* Price */}
              <div className="mb-8 pb-8 border-b border-white/[0.07]">
                <div className="flex items-end gap-1">
                  <span className="font-display font-extrabold text-white" style={{ fontSize:'clamp(2.5rem,5vw,3.5rem)', lineHeight:1 }}>
                    <AnimatePresence mode="wait">
                      <motion.span key={recurring?'r':'o'}
                        initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                        transition={{ duration:0.2 }}
                        className="inline-block"
                      >
                        €{recurring ? plan.priceRecurr : plan.priceOnce}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="font-sans text-white/35 text-sm mb-2">{recurring?'/mês':'/ vez'}</span>
                </div>
                {recurring && (
                  <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="font-sans text-emerald-400 text-xs mt-1">
                    Antes €{plan.priceOnce} — Poupa €{plan.priceOnce-plan.priceRecurr}/mês
                  </motion.div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center"
                      style={{ background:`${plan.color}20` }}>
                      <Check className="w-2.5 h-2.5" style={{ color:plan.color }}/>
                    </div>
                    <span className="font-sans text-white/55 text-sm leading-snug">{f}</span>
                  </li>
                ))}
              </ul>

              <a href="#contact"
                className={`group flex items-center justify-center gap-2 font-display font-bold text-sm py-4 rounded-2xl transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white hover:shadow-xl hover:shadow-sky-500/30 hover:scale-105'
                    : 'bg-white/[0.06] text-white hover:bg-white/10 border border-white/10'
                }`}>
                Escolher {plan.name}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
              </a>
            </motion.div>
          ))}
        </div>

        <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
          className="text-center font-sans text-white/20 text-sm mt-8">
          Todos os planos incluem produtos e equipamento. Sem custos escondidos. Fatura incluída.
        </motion.p>
      </div>
    </section>
  )
}
