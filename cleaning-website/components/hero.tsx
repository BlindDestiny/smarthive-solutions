'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Star, Shield, Clock, ChevronDown, Check } from 'lucide-react'
import Image from 'next/image'

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target:ref, offset:['start start','end start'] })
  const y       = useTransform(scrollYProgress, [0,1], ['0%','18%'])
  const opacity = useTransform(scrollYProgress, [0,0.5], [1,0])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden bg-[#06090f] pt-20">

      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute rounded-full blur-[130px] opacity-20"
          style={{ width:650, height:650, background:'radial-gradient(circle,#0ea5e9,transparent)', top:'-5%', left:'-10%' }}
          animate={{ x:[0,30,-15,0], y:[0,-25,15,0] }}
          transition={{ duration:20, repeat:Infinity, ease:'easeInOut' }}
        />
        <motion.div className="absolute rounded-full blur-[90px] opacity-15"
          style={{ width:450, height:450, background:'radial-gradient(circle,#34d399,transparent)', bottom:'5%', right:'0%' }}
          animate={{ x:[0,-25,10,0], y:[0,20,-10,0] }}
          transition={{ duration:16, repeat:Infinity, ease:'easeInOut', delay:3 }}
        />
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage:'linear-gradient(rgba(56,189,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)', backgroundSize:'64px 64px' }}
        />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[1fr_480px] gap-12 xl:gap-20 items-center py-16 lg:py-24">

          {/* Left */}
          <div className="max-w-xl">
            {/* Live badge */}
            <motion.div
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.5, delay:0.1 }}
              className="inline-flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"/>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"/>
              </span>
              <span className="font-sans text-emerald-300 text-xs">12 limpezas activas agora em Lisboa</span>
            </motion.div>

            {/* Headline */}
            <div className="overflow-hidden mb-2">
              {['A sua casa.', 'Impecavelmente'].map((line, i) => (
                <div key={i} className="overflow-hidden">
                  <motion.h1
                    className={`block font-display font-extrabold text-white leading-[1.08] ${i === 0 ? 'text-white/50' : ''}`}
                    style={{ fontSize:'clamp(2.6rem,5.5vw,4.8rem)' }}
                    initial={{ y:'105%' }}
                    animate={{ y:0 }}
                    transition={{ duration:0.8, delay:0.2 + i*0.1, ease:[0.22,1,0.36,1] }}
                  >
                    {line}
                  </motion.h1>
                </div>
              ))}
              <div className="overflow-hidden">
                <motion.div
                  className="font-display font-extrabold leading-[1.08]"
                  style={{ fontSize:'clamp(2.6rem,5.5vw,4.8rem)' }}
                  initial={{ y:'105%' }}
                  animate={{ y:0 }}
                  transition={{ duration:0.8, delay:0.38, ease:[0.22,1,0.36,1] }}
                >
                  <span className="gradient-text">limpa.</span>
                </motion.div>
              </div>
            </div>

            <motion.p
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, delay:0.6 }}
              className="font-sans text-white/45 text-base lg:text-[17px] leading-relaxed mb-10 max-w-sm"
            >
              Equipas profissionais certificadas. Produtos eco-friendly. Resultado garantido — ou repetimos de graça.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.5, delay:0.75 }}
              className="flex flex-wrap items-center gap-4 mb-12"
            >
              <a href="#contact"
                className="group flex items-center gap-2.5 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-display font-bold text-[15px] px-7 py-4 rounded-2xl hover:shadow-xl hover:shadow-sky-500/25 hover:scale-[1.03] transition-all duration-300">
                Orçamento grátis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a href="tel:912345678"
                className="flex items-center gap-2 font-sans text-sm text-white/50 hover:text-white transition-colors group">
                <Clock className="w-4 h-4 text-sky-400" />
                Resposta em 5 minutos
              </a>
            </motion.div>

            {/* Social proof row */}
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1 }}
              className="flex items-center gap-5 pt-8 border-t border-white/[0.07]"
            >
              <div className="flex -space-x-2">
                {['38bdf8','34d399','818cf8','f472b6'].map((c,i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#06090f] flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background:`#${c}` }}>
                    {['MF','RS','AB','LC'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400"/>)}
                  <span className="font-display font-bold text-white text-sm ml-1.5">4.9</span>
                </div>
                <div className="font-sans text-white/30 text-xs mt-0.5">500+ famílias satisfeitas em Lisboa</div>
              </div>
            </motion.div>
          </div>

          {/* Right — image */}
          <motion.div
            initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
            transition={{ duration:1, delay:0.25, ease:[0.22,1,0.36,1] }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10">
              <Image
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=960&q=85&auto=format&fit=crop"
                alt="Professional cleaning service"
                width={480} height={560}
                className="object-cover w-full aspect-[4/5]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06090f]/70 via-transparent to-transparent" />
            </div>

            {/* Floating: active team */}
            <motion.div animate={{ y:[0,-6,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
              className="absolute -top-5 -left-8 card-glass rounded-2xl px-5 py-4 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                  <span className="text-lg">🧹</span>
                </div>
                <div>
                  <div className="font-display font-bold text-white text-sm">Em serviço agora</div>
                  <div className="font-sans text-white/40 text-xs">12 equipas · Lisboa</div>
                </div>
                <span className="ml-1 relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"/>
                  <span className="relative rounded-full h-2 w-2 bg-emerald-400"/>
                </span>
              </div>
            </motion.div>

            {/* Floating: guarantee */}
            <motion.div animate={{ y:[0,7,0] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut', delay:1 }}
              className="absolute -bottom-5 -right-6 card-glass rounded-2xl px-5 py-4 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <div className="font-display font-bold text-white text-sm">Garantia total</div>
                  <div className="font-sans text-white/40 text-xs">Não ficou? Repetimos.</div>
                </div>
              </div>
            </motion.div>

            {/* Inline guarantee list */}
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }}
              className="absolute bottom-12 left-5 right-5"
            >
              <div className="bg-[#06090f]/80 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/10">
                {['Produtos eco-friendly certificados','Seguro de responsabilidade civil','Preço fechado sem surpresas'].map(g => (
                  <div key={g} className="flex items-center gap-2.5 py-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="font-sans text-white/70 text-xs">{g}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div animate={{ y:[0,5,0] }} transition={{ duration:1.6, repeat:Infinity }}>
          <ChevronDown className="w-5 h-5 text-white/15" />
        </motion.div>
      </motion.div>
    </section>
  )
}
