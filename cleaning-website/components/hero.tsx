'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Star, Shield, Clock, ChevronDown } from 'lucide-react'
import Image from 'next/image'

const BADGES = [
  { icon:'⭐', value:'4.9/5', label:'Google Reviews' },
  { icon:'🏠', value:'500+', label:'Casas limpas' },
  { icon:'✅', value:'100%', label:'Satisfação garantida' },
]

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target:ref, offset:['start start','end start'] })
  const y       = useTransform(scrollYProgress, [0,1], ['0%','20%'])
  const opacity = useTransform(scrollYProgress, [0,0.6], [1,0])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden bg-[#06090f] pt-20">

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute rounded-full blur-[120px] opacity-25"
          style={{ width:700, height:700, background:'radial-gradient(circle, #0ea5e9, transparent)', top:'-10%', left:'-5%' }}
          animate={{ x:[0,40,-20,0], y:[0,-30,20,0], scale:[1,1.1,0.95,1] }}
          transition={{ duration:18, repeat:Infinity, ease:'easeInOut' }}
        />
        <motion.div className="absolute rounded-full blur-[100px] opacity-20"
          style={{ width:500, height:500, background:'radial-gradient(circle, #34d399, transparent)', bottom:'10%', right:'5%' }}
          animate={{ x:[0,-30,15,0], y:[0,25,-15,0], scale:[1,1.15,0.9,1] }}
          transition={{ duration:14, repeat:Infinity, ease:'easeInOut', delay:2 }}
        />
        <motion.div className="absolute rounded-full blur-[80px] opacity-15"
          style={{ width:350, height:350, background:'radial-gradient(circle, #818cf8, transparent)', top:'40%', left:'40%' }}
          animate={{ x:[0,20,-10,0], y:[0,-20,10,0] }}
          transition={{ duration:20, repeat:Infinity, ease:'easeInOut', delay:5 }}
        />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage:'linear-gradient(rgba(56,189,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)', backgroundSize:'60px 60px' }}
        />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center py-20">

          {/* Left */}
          <div>
            {/* Trust pill */}
            <motion.div
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, delay:0.1 }}
              className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-4 py-2 mb-8"
            >
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-sky-400 opacity-75"/>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400"/>
              </span>
              <span className="font-sans text-sky-300 text-xs tracking-wide">Lisboa · Disponível hoje</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity:0 }} animate={{ opacity:1 }}
              transition={{ duration:0.4, delay:0.15 }}
              className="font-display font-extrabold leading-[1.05] mb-6"
              style={{ fontSize:'clamp(2.8rem, 6vw, 5rem)' }}
            >
              {['O seu espaço', 'merece ficar'].map((line, i) => (
                <motion.span key={i} className="block overflow-hidden">
                  <motion.span
                    className="block text-white"
                    initial={{ y:'100%' }}
                    animate={{ y:0 }}
                    transition={{ duration:0.75, delay:0.2 + i*0.1, ease:[0.22,1,0.36,1] }}
                  >
                    {line}
                  </motion.span>
                </motion.span>
              ))}
              <motion.span
                className="block overflow-hidden"
                initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
              >
                <span className="gradient-text">impecável.</span>
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.7, delay:0.55 }}
              className="font-sans text-white/50 text-lg leading-relaxed mb-10 max-w-md"
            >
              Limpeza profissional para casas e escritórios em Lisboa. Equipas certificadas, produtos eco-friendly, resultados garantidos.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, delay:0.7 }}
              className="flex flex-wrap items-center gap-4 mb-12"
            >
              <a href="#contact"
                className="group flex items-center gap-2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-display font-bold text-[15px] px-7 py-4 rounded-2xl hover:shadow-xl hover:shadow-sky-500/30 hover:scale-105 transition-all duration-300">
                Pedir orçamento grátis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#services"
                className="flex items-center gap-2 font-sans text-white/60 hover:text-white text-[15px] transition-colors group">
                Ver serviços
                <span className="w-6 h-px bg-white/30 group-hover:w-10 group-hover:bg-sky-400 transition-all duration-300" />
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}
              className="flex flex-wrap gap-4"
            >
              {BADGES.map((b, i) => (
                <motion.div key={b.label} initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
                  transition={{ delay: 0.9 + i*0.1, type:'spring', stiffness:400, damping:20 }}
                  className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-2.5"
                >
                  <span className="text-lg">{b.icon}</span>
                  <div>
                    <div className="font-display font-bold text-white text-sm leading-none">{b.value}</div>
                    <div className="font-sans text-white/35 text-[11px] mt-0.5">{b.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right — image + floating cards */}
          <motion.div
            initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }}
            transition={{ duration:1, delay:0.3, ease:[0.22,1,0.36,1] }}
            className="relative hidden lg:block"
          >
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 to-emerald-500/5 z-10 pointer-events-none rounded-3xl ring-1 ring-white/10" />
              <Image
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80&auto=format&fit=crop"
                alt="Clean home"
                width={600} height={700}
                className="object-cover w-full aspect-[4/5]"
              />
            </div>

            {/* Floating card — live cleaning */}
            <motion.div animate={{ y:[0,-8,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
              className="absolute -top-6 -left-8 card-glass rounded-2xl px-5 py-4 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 flex items-center justify-center">
                  <Clock className="w-4.5 h-4.5 text-sky-400" style={{width:18,height:18}}/>
                </div>
                <div>
                  <div className="font-display font-bold text-white text-sm">A limpar agora</div>
                  <div className="font-sans text-white/40 text-xs">12 equipas activas</div>
                </div>
                <span className="flex h-2 w-2 ml-1">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"/>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"/>
                </span>
              </div>
            </motion.div>

            {/* Floating card — guarantee */}
            <motion.div animate={{ y:[0,8,0] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut', delay:1 }}
              className="absolute -bottom-6 -right-8 card-glass rounded-2xl px-5 py-4 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Shield className="w-4.5 h-4.5 text-emerald-400" style={{width:18,height:18}}/>
                </div>
                <div>
                  <div className="font-display font-bold text-white text-sm">100% Garantido</div>
                  <div className="font-sans text-white/40 text-xs">Ou repetimos de graça</div>
                </div>
              </div>
            </motion.div>

            {/* Floating stars */}
            <motion.div animate={{ y:[0,-5,0] }} transition={{ duration:3.5, repeat:Infinity, ease:'easeInOut', delay:2 }}
              className="absolute top-1/2 -right-10 card-glass rounded-2xl px-4 py-3 shadow-xl"
            >
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400"/>)}
                </div>
                <span className="font-display font-bold text-white text-sm">4.9</span>
              </div>
              <div className="font-sans text-white/35 text-[10px] mt-0.5">287 avaliações</div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <motion.div animate={{ y:[0,6,0] }} transition={{ duration:1.5, repeat:Infinity }}>
          <ChevronDown className="w-5 h-5 text-white/20"/>
        </motion.div>
      </motion.div>
    </section>
  )
}
