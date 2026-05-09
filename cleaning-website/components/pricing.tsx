'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight, Sparkles } from 'lucide-react'

const PLANS = [
  {
    name:'Essencial', desc:'Para espaços pequenos e manutenção regular.',
    priceOnce:99, priceRecurr:79,
    features:['Cozinha completa','Casas de banho (até 2)','Sala e quartos','Aspiração e lavagem','2–3 horas · 1 profissional'],
    highlight: false,
  },
  {
    name:'Standard', desc:'A escolha mais popular para famílias.',
    priceOnce:149, priceRecurr:119,
    features:['Tudo do Essencial','Arrumação e organização','Janelas interiores','Interior de electrodomésticos','4–5 horas · 2 profissionais','Relatório fotográfico'],
    highlight: true,
  },
  {
    name:'Premium', desc:'Limpeza total sem deixar nada por fazer.',
    priceOnce:219, priceRecurr:179,
    features:['Tudo do Standard','Janelas exteriores (R/C)','Varandas e exterior','6+ horas · 2–3 profissionais','Garantia extendida 7 dias'],
    highlight: false,
  },
]

export default function Pricing() {
  const [recurring, setRecurring] = useState(false)

  return (
    <section id="pricing" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="text-center mb-14">
          <motion.span initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            className="inline-block badge-light text-sky-700 font-sans text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            Preços transparentes
          </motion.span>
          <motion.h2 initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.65 }}
            className="font-display font-extrabold text-slate-900 mb-5" style={{ fontSize:'clamp(1.9rem,3.5vw,2.8rem)' }}>
            Escolha o seu plano
          </motion.h2>

          {/* Toggle */}
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            transition={{ delay:0.15 }}
            className="inline-flex items-center gap-4">
            <span className={`font-sans text-sm transition-colors ${!recurring?'text-slate-900 font-semibold':'text-slate-400'}`}>Única vez</span>
            <button onClick={()=>setRecurring(v=>!v)}
              className={`relative w-13 h-7 rounded-full transition-colors duration-300 ${recurring?'bg-sky-600':'bg-slate-200'}`}
              style={{ width:52, height:28 }}>
              <motion.div
                animate={{ x: recurring ? 26 : 4 }}
                transition={{ type:'spring', stiffness:500, damping:30 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
              />
            </button>
            <span className={`font-sans text-sm transition-colors ${recurring?'text-slate-900 font-semibold':'text-slate-400'}`}>
              Recorrente
              <span className="ml-2 text-xs font-bold text-sky-600 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-full">
                −20%
              </span>
            </span>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div key={plan.name}
              initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ duration:0.65, delay:i*0.1, ease:[0.22,1,0.36,1] }}
              className={`relative rounded-3xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                plan.highlight
                  ? 'bg-[#0f172a] shadow-2xl shadow-slate-900/20'
                  : 'card hover:border-sky-200 hover:shadow-md hover:shadow-sky-50'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-sky-600 text-white font-display font-bold text-xs px-4 py-1.5 rounded-full shadow">
                  <Sparkles className="w-3 h-3"/> Mais popular
                </div>
              )}

              <div className="mb-6">
                <h3 className={`font-display font-bold text-xl mb-1 ${plan.highlight?'text-white':'text-slate-900'}`}>{plan.name}</h3>
                <p className={`font-sans text-sm ${plan.highlight?'text-white/40':'text-slate-400'}`}>{plan.desc}</p>
              </div>

              <div className={`mb-7 pb-7 border-b ${plan.highlight?'border-white/10':'border-slate-100'}`}>
                <div className="flex items-end gap-1">
                  <span className={`font-display font-extrabold leading-none ${plan.highlight?'text-white':'text-slate-900'}`}
                    style={{ fontSize:'clamp(2.4rem,4vw,3rem)' }}>
                    <AnimatePresence mode="wait">
                      <motion.span key={recurring?'r':'o'}
                        initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
                        transition={{ duration:0.2 }} className="inline-block">
                        €{recurring ? plan.priceRecurr : plan.priceOnce}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className={`font-sans text-sm mb-2 ${plan.highlight?'text-white/30':'text-slate-400'}`}>
                    {recurring?'/mês':'/ vez'}
                  </span>
                </div>
                {recurring && (
                  <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                    className="font-sans text-sky-400 text-xs mt-1">
                    Poupa €{plan.priceOnce-plan.priceRecurr}/mês vs. única vez
                  </motion.div>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-3">
                    <div className={`w-4 h-4 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center ${
                      plan.highlight ? 'bg-sky-500/20' : 'bg-sky-50'
                    }`}>
                      <Check className="w-2.5 h-2.5 text-sky-500"/>
                    </div>
                    <span className={`font-sans text-sm ${plan.highlight?'text-white/55':'text-slate-500'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <a href="#contact"
                className={`group flex items-center justify-center gap-2 font-display font-bold text-sm py-4 rounded-2xl transition-all duration-200 ${
                  plan.highlight
                    ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-900/30'
                    : 'bg-slate-900 hover:bg-sky-600 text-white'
                }`}>
                Escolher {plan.name}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"/>
              </a>
            </motion.div>
          ))}
        </div>

        <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
          className="text-center font-sans text-slate-400 text-sm mt-8">
          Todos os planos incluem material e produtos. Fatura emitida. Sem custos escondidos.
        </motion.p>
      </div>
    </section>
  )
}
