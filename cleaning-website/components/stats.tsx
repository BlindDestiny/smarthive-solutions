'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { motion } from 'framer-motion'
import { Users, Star, Clock, Award } from 'lucide-react'

function Counter({ to, suffix='', decimals=0 }: { to:number; suffix?:string; decimals?:number }) {
  const [v, setV] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once:true, margin:'-80px' })
  useEffect(() => {
    if (!inView) return
    const s = performance.now(), d = 1600
    const f = (n:number) => {
      const p = Math.min((n-s)/d,1), e=1-Math.pow(1-p,3)
      setV(parseFloat((e*to).toFixed(decimals)))
      if (p<1) requestAnimationFrame(f)
    }
    requestAnimationFrame(f)
  }, [inView, to, decimals])
  return <span ref={ref}>{decimals>0?v.toFixed(decimals):v.toLocaleString('pt-PT')}{suffix}</span>
}

const STATS = [
  { Icon:Users,  to:500,  suffix:'+', decimals:0, label:'Clientes satisfeitos',    sub:'e a crescer' },
  { Icon:Star,   to:4.9,  suffix:'',  decimals:1, label:'Avaliação Google',        sub:'★★★★★' },
  { Icon:Clock,  to:3,    suffix:' anos', decimals:0, label:'De experiência',      sub:'no mercado' },
  { Icon:Award,  to:100,  suffix:'%', decimals:0, label:'Satisfação garantida',    sub:'ou repetimos grátis' },
]

export default function Stats() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#060915]">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-sky-500/5 blur-[80px] rounded-full"/>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04] rounded-3xl overflow-hidden">
          {STATS.map((s,i) => (
            <motion.div key={s.label}
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ duration:0.6, delay:i*0.1 }}
              className="bg-[#06090f] p-10 text-center group hover:bg-sky-500/5 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <s.Icon className="w-5 h-5 text-sky-400"/>
              </div>
              <div className="font-display font-extrabold text-white mb-1 gradient-text"
                style={{ fontSize:'clamp(2rem,4vw,3rem)' }}>
                <Counter to={s.to} suffix={s.suffix} decimals={s.decimals}/>
              </div>
              <div className="font-sans text-white/60 text-sm mb-1">{s.label}</div>
              <div className="font-sans text-white/25 text-xs tracking-wide">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
