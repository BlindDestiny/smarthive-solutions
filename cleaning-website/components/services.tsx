'use client'
import { motion } from 'framer-motion'
import { Home, Building2, Sparkles, Truck, Layers, HardHat, ArrowRight, Check } from 'lucide-react'

const SERVICES = [
  {
    icon: Home, label:'Limpeza Residencial',
    desc:'Limpeza completa da sua casa com atenção a cada detalhe — cozinha, casas de banho, quartos e salas.',
    features:['Produtos eco-friendly','Equipas certificadas','Agendamento flexível'],
    accent:'#0284c7',
    img:'https://images.unsplash.com/photo-1527515637462-cff94ead201b?w=900&q=85&auto=format&fit=crop',
  },
  {
    icon: Building2, label:'Escritórios',
    desc:'Espaços de trabalho limpos e higienizados. Fora do horário comercial, sem disrução.',
    features:['Planos semanais/mensais','Contrato sem fidelização'],
    accent:'#0284c7',
  },
  {
    icon: Sparkles, label:'Limpeza Profunda',
    desc:'Desinfecção total, cantos, recantos e electrodomésticos. Ideal de 6 em 6 meses.',
    features:['Interior de electrodomésticos','Desinfecção certificada'],
    accent:'#0284c7',
  },
  {
    icon: Truck, label:'Mudanças',
    desc:'Antes de entrar ou ao sair. Certificado de limpeza incluído.',
    features:['Check-list completo','Certificado entregue'],
    accent:'#0284c7',
  },
  {
    icon: Layers, label:'Limpeza de Janelas',
    desc:'Interior e exterior sem riscas. Deixa entrar toda a luz natural.',
    features:['Até 4.º andar','Material especializado'],
    accent:'#0284c7',
  },
  {
    icon: HardHat, label:'Pós-Obra',
    desc:'Remoção de pó, resíduos e materiais. O seu espaço pronto a habitar.',
    features:['Gestão de resíduos','Polimento de pavimentos'],
    accent:'#0284c7',
  },
]

export default function Services() {
  return (
    <section id="services" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <motion.span initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              className="inline-block badge-light text-sky-700 font-sans text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              O que fazemos
            </motion.span>
            <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ duration:0.65 }}
              className="font-display font-extrabold text-slate-900" style={{ fontSize:'clamp(1.9rem,3.5vw,2.8rem)' }}>
              Serviços para cada<br/>necessidade
            </motion.h2>
          </div>
          <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            className="font-sans text-slate-400 text-sm max-w-xs leading-relaxed lg:text-right">
            De limpezas regulares a grandes intervenções. Orçamento grátis, resposta imediata.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Featured card */}
          <motion.div
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.65 }}
            className="lg:col-span-2 group relative rounded-3xl overflow-hidden cursor-pointer min-h-[340px] flex flex-col justify-end"
          >
            <div className="absolute inset-0">
              <img src={SERVICES[0].img} alt={SERVICES[0].label}
                className="w-full h-full object-cover brightness-[0.55] group-hover:brightness-[0.65] group-hover:scale-[1.03] transition-all duration-700"/>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/50 to-transparent"/>
            </div>
            <div className="relative z-10 p-8">
              <span className="inline-flex items-center gap-1.5 bg-sky-600/90 text-white font-sans text-xs font-semibold px-3 py-1 rounded-full mb-4">
                <Home className="w-3 h-3"/> Mais popular
              </span>
              <h3 className="font-display font-bold text-white text-2xl mb-2">{SERVICES[0].label}</h3>
              <p className="font-sans text-white/60 text-sm leading-relaxed mb-5 max-w-sm">{SERVICES[0].desc}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {SERVICES[0].features.map(f => (
                  <span key={f} className="flex items-center gap-1.5 font-sans text-xs text-white/80 bg-white/10 border border-white/15 rounded-full px-3 py-1">
                    <Check className="w-3 h-3 text-sky-400"/>{f}
                  </span>
                ))}
              </div>
              <a href="#contact" className="inline-flex items-center gap-2 bg-white text-[#0f172a] font-display font-bold text-sm px-6 py-3 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition-colors">
                Pedir orçamento <ArrowRight className="w-4 h-4"/>
              </a>
            </div>
          </motion.div>

          {/* Small cards */}
          {SERVICES.slice(1).map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ duration:0.65, delay:(i+1)*0.07 }}
              className="group card p-7 hover:border-sky-200 hover:shadow-md hover:shadow-sky-50 transition-all duration-300 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center mb-5 group-hover:bg-sky-600 group-hover:border-sky-600 transition-all duration-300">
                <s.icon className="w-5 h-5 text-sky-600 group-hover:text-white transition-colors duration-300"/>
              </div>
              <h3 className="font-display font-bold text-slate-900 text-lg mb-2 group-hover:text-sky-700 transition-colors">{s.label}</h3>
              <p className="font-sans text-slate-400 text-sm leading-relaxed mb-4">{s.desc}</p>
              <div className="space-y-1.5">
                {s.features.map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-sky-500 flex-shrink-0"/>
                    <span className="font-sans text-slate-400 text-xs">{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
