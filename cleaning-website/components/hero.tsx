'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Star, Shield, Clock, Check, ChevronDown } from 'lucide-react'
import Image from 'next/image'

const PROOF = [
  { value:'500+',  label:'casas limpas' },
  { value:'4.9★',  label:'Google Reviews' },
  { value:'100%',  label:'garantia' },
]

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target:ref, offset:['start start','end start'] })
  const y       = useTransform(scrollYProgress, [0,1], ['0%','18%'])
  const opacity = useTransform(scrollYProgress, [0,0.6], [1,0])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden bg-[#0f172a] pt-20">

      {/* Subtle background grain/gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-white/5" />
        <motion.div className="absolute rounded-full blur-[160px] opacity-15"
          style={{ width:700, height:700, background:'#0284c7', top:'-10%', left:'-5%' }}
          animate={{ scale:[1,1.08,1] }}
          transition={{ duration:14, repeat:Infinity, ease:'easeInOut' }}
        />
        <motion.div className="absolute rounded-full blur-[120px] opacity-08"
          style={{ width:400, height:400, background:'#0284c7', bottom:'10%', right:'5%' }}
          animate={{ scale:[1,1.12,1] }}
          transition={{ duration:18, repeat:Infinity, ease:'easeInOut', delay:4 }}
        />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[1fr_460px] gap-12 xl:gap-20 items-center py-16 lg:py-24">

          {/* Left */}
          <div className="max-w-lg">
            {/* Live badge */}
            <motion.div
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.5, delay:0.1 }}
              className="inline-flex items-center gap-2.5 badge-dark rounded-full px-4 py-2 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"/>
                <span className="relative flex rounded-full h-2 w-2 bg-emerald-400"/>
              </span>
              <span className="font-sans text-white/70 text-xs">12 equipas activas agora em Lisboa</span>
            </motion.div>

            {/* Headline — short words, no truncation risk */}
            <div className="mb-6">
              {['O seu espaço,'].map((line, i) => (
                <div key={i} className="overflow-hidden">
                  <motion.div
                    className="font-display font-extrabold text-white/50 leading-[1.1]"
                    style={{ fontSize:'clamp(2.4rem,4.5vw,4rem)' }}
                    initial={{ y:'110%' }}
                    animate={{ y:0 }}
                    transition={{ duration:0.75, delay:0.2+i*0.1, ease:[0.22,1,0.36,1] }}
                  >
                    {line}
                  </motion.div>
                </div>
              ))}
              <div className="overflow-hidden">
                <motion.div
                  className="font-display font-extrabold text-white leading-[1.1]"
                  style={{ fontSize:'clamp(2.4rem,4.5vw,4rem)' }}
                  initial={{ y:'110%' }}
                  animate={{ y:0 }}
                  transition={{ duration:0.75, delay:0.3, ease:[0.22,1,0.36,1] }}
                >
                  impecável.
                </motion.div>
              </div>
            </div>

            <motion.p
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, delay:0.55 }}
              className="font-sans text-white/45 text-base leading-relaxed mb-10 max-w-sm"
            >
              Equipas certificadas, produtos eco-friendly e resultado garantido. Sem surpresas, sem stress.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.5, delay:0.7 }}
              className="flex flex-wrap items-center gap-4 mb-12"
            >
              <a href="#contact"
                className="group flex items-center gap-2.5 bg-sky-600 hover:bg-sky-500 text-white font-display font-bold text-[15px] px-7 py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-sky-900/40">
                Orçamento grátis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a href="#process"
                className="flex items-center gap-2 font-sans text-sm text-white/40 hover:text-white/70 transition-colors">
                <Clock className="w-4 h-4" />
                Resposta em 5 minutos
              </a>
            </motion.div>

            {/* Proof pills */}
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}
              className="flex flex-wrap items-center gap-4 pt-8 border-t border-white/[0.07]"
            >
              {PROOF.map((p, i) => (
                <motion.div key={p.label}
                  initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                  transition={{ delay:0.9+i*0.08, type:'spring', stiffness:400, damping:20 }}
                  className="flex items-center gap-2.5 badge-dark rounded-2xl px-4 py-2.5"
                >
                  <span className="font-display font-bold text-white text-sm">{p.value}</span>
                  <span className="font-sans text-white/35 text-xs">{p.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right */}
          <motion.div
            initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }}
            transition={{ duration:0.9, delay:0.2, ease:[0.22,1,0.36,1] }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-[2rem] overflow-hidden ring-1 ring-white/10 shadow-2xl shadow-black/50">
              <Image
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=920&q=85&auto=format&fit=crop"
                alt="Limpeza profissional"
                width={460} height={560}
                className="object-cover w-full aspect-[4/5]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/60 via-transparent to-transparent" />
            </div>

            {/* Floating — active */}
            <motion.div animate={{ y:[0,-7,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
              className="absolute -top-5 -left-8 card-dark px-5 py-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-lg">🧹</div>
                <div>
                  <div className="font-display font-bold text-white text-sm">12 equipas activas</div>
                  <div className="font-sans text-white/40 text-xs">agora em Lisboa</div>
                </div>
                <span className="relative flex h-2 w-2 ml-1">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"/>
                  <span className="relative rounded-full h-2 w-2 bg-emerald-400"/>
                </span>
              </div>
            </motion.div>

            {/* Floating — guarantee */}
            <motion.div animate={{ y:[0,7,0] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut', delay:1.5 }}
              className="absolute -bottom-5 -right-6 card-dark px-5 py-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 flex items-center justify-center">
                  <Shield className="w-4.5 h-4.5 text-sky-400" style={{ width:18, height:18 }}/>
                </div>
                <div>
                  <div className="font-display font-bold text-white text-sm">100% Garantido</div>
                  <div className="font-sans text-white/40 text-xs">Ou repetimos grátis</div>
                </div>
              </div>
            </motion.div>

            {/* Inline checklist */}
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1 }}
              className="absolute bottom-10 left-5 right-5 card-dark px-5 py-4"
            >
              {['Equipas verificadas e seguradas','Produtos eco-friendly certificados','Preço fixo, sem surpresas'].map(g => (
                <div key={g} className="flex items-center gap-2.5 py-1.5">
                  <Check className="w-3.5 h-3.5 text-sky-400 flex-shrink-0"/>
                  <span className="font-sans text-white/65 text-xs">{g}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div animate={{ y:[0,5,0] }} transition={{ duration:1.6, repeat:Infinity }}>
          <ChevronDown className="w-5 h-5 text-white/15"/>
        </motion.div>
      </motion.div>
    </section>
  )
}
