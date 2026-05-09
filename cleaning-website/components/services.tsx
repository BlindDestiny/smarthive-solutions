'use client'
import { motion } from 'framer-motion'
import { Home, Building2, Sparkles, Truck, Layers, HardHat, ArrowRight, Check } from 'lucide-react'

const SERVICES = [
  {
    icon: Home, label:'Limpeza Residencial',
    desc:'Limpeza completa da sua casa com atenção a cada detalhe. Cozinha, casas de banho, quartos e salas reluzentes.',
    features:['Produtos eco-friendly','Equipas certificadas','Agendamento flexível'],
    accent:'#38bdf8', size:'lg',
    img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop',
  },
  {
    icon: Building2, label:'Escritórios & Comercial',
    desc:'Espaços de trabalho limpos e higienizados para aumentar a produtividade da sua equipa.',
    features:['Fora do horário comercial','Planos semanais/mensais'],
    accent:'#34d399', size:'sm',
  },
  {
    icon: Sparkles, label:'Limpeza Profunda',
    desc:'Limpeza intensiva de todas as superfícies, cantos e recantos. Ideal de 6 em 6 meses.',
    features:['Desinfecção total','Incluí electros'],
    accent:'#818cf8', size:'sm',
  },
  {
    icon: Truck, label:'Mudanças',
    desc:'Antes de entrar ou depois de sair. Deixe o espaço impecável para o próximo capítulo.',
    features:['Check-list completo','Certificado de limpeza'],
    accent:'#f472b6', size:'sm',
  },
  {
    icon: Layers, label:'Limpeza de Janelas',
    desc:'Interior e exterior. Vidros sem manchas que deixam entrar toda a luz natural.',
    features:['Até 4º andar','Sem riscas'],
    accent:'#fb923c', size:'sm',
  },
  {
    icon: HardHat, label:'Pós-Obra',
    desc:'Remoção de pó, resíduos e materiais de construção. O seu espaço pronto a habitar.',
    features:['Gestão de resíduos','Polimento de pisos'],
    accent:'#facc15', size:'sm',
  },
]

export default function Services() {
  return (
    <section id="services" className="py-32 bg-[#06090f]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-3 py-1.5 mb-5"
            >
              <Sparkles className="w-3 h-3 text-sky-400"/>
              <span className="font-sans text-sky-300 text-xs tracking-wide">O que fazemos</span>
            </motion.div>
            <motion.h2 initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ duration:0.7 }}
              className="font-display font-extrabold text-white" style={{ fontSize:'clamp(2rem,4vw,3.5rem)' }}>
              Serviços para cada<br/>
              <span className="gradient-text">necessidade</span>
            </motion.h2>
          </div>
          <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            className="font-sans text-white/40 text-base max-w-xs leading-relaxed lg:text-right">
            De limpezas regulares a grandes intervenções, temos a solução certa para si.
          </motion.p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Large featured card */}
          <motion.div
            initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.7 }}
            className="lg:col-span-2 group relative rounded-3xl overflow-hidden cursor-pointer min-h-[380px] flex flex-col justify-end"
          >
            {/* Background image */}
            <div className="absolute inset-0">
              <img src={SERVICES[0].img} alt={SERVICES[0].label} className="w-full h-full object-cover brightness-50 group-hover:brightness-60 group-hover:scale-105 transition-all duration-700"/>
              <div className="absolute inset-0 bg-gradient-to-t from-[#06090f] via-[#06090f]/60 to-transparent"/>
            </div>
            <div className="relative z-10 p-8">
              <div className="inline-flex items-center gap-2 bg-sky-500/20 border border-sky-500/30 rounded-full px-3 py-1 mb-4">
                <Home className="w-3.5 h-3.5 text-sky-400"/>
                <span className="font-sans text-sky-300 text-xs">Mais popular</span>
              </div>
              <h3 className="font-display font-bold text-white text-2xl mb-2">{SERVICES[0].label}</h3>
              <p className="font-sans text-white/60 text-sm leading-relaxed mb-5 max-w-sm">{SERVICES[0].desc}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {SERVICES[0].features.map(f => (
                  <span key={f} className="flex items-center gap-1.5 font-sans text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
                    <Check className="w-3 h-3"/>
                    {f}
                  </span>
                ))}
              </div>
              <a href="#contact" className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-display font-bold text-sm px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-sky-500/30 hover:gap-3 transition-all duration-300">
                Pedir orçamento <ArrowRight className="w-4 h-4"/>
              </a>
            </div>
          </motion.div>

          {/* Regular cards — right column top */}
          {SERVICES.slice(1, 3).map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ duration:0.7, delay:(i+1)*0.1 }}
              className="group card-glass rounded-3xl p-7 hover:border-sky-500/20 transition-all duration-300 hover:shadow-xl cursor-pointer min-h-[180px]"
              style={{ borderColor: `${s.accent}15` }}
            >
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 duration-300"
                style={{ background:`${s.accent}18`, border:`1px solid ${s.accent}30` }}>
                <s.icon className="w-5 h-5" style={{ color:s.accent }}/>
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-2">{s.label}</h3>
              <p className="font-sans text-white/40 text-sm leading-relaxed mb-4">{s.desc}</p>
              <div className="space-y-1.5">
                {s.features.map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <Check className="w-3 h-3 flex-shrink-0" style={{ color:s.accent }}/>
                    <span className="font-sans text-white/40 text-xs">{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Bottom row — 3 regular cards */}
          {SERVICES.slice(3).map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ duration:0.7, delay:(i+3)*0.1 }}
              className="group card-glass rounded-3xl p-7 hover:border-sky-500/20 transition-all duration-300 hover:shadow-xl cursor-pointer"
              style={{ borderColor:`${s.accent}15` }}
            >
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 duration-300"
                style={{ background:`${s.accent}18`, border:`1px solid ${s.accent}30` }}>
                <s.icon className="w-5 h-5" style={{ color:s.accent }}/>
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-2">{s.label}</h3>
              <p className="font-sans text-white/40 text-sm leading-relaxed mb-4">{s.desc}</p>
              <div className="space-y-1.5">
                {s.features.map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <Check className="w-3 h-3 flex-shrink-0" style={{ color:s.accent }}/>
                    <span className="font-sans text-white/40 text-xs">{f}</span>
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
