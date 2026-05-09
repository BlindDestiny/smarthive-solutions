'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { motion } from 'framer-motion'

function Counter({ to, suffix='', decimals=0 }: { to:number; suffix?:string; decimals?:number }) {
  const [v, setV] = useState(0)
  const ref    = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once:true, margin:'-80px' })
  useEffect(() => {
    if (!inView) return
    const s=performance.now(), d=1600
    const f=(n:number)=>{
      const p=Math.min((n-s)/d,1), e=1-Math.pow(1-p,3)
      setV(parseFloat((e*to).toFixed(decimals)))
      if (p<1) requestAnimationFrame(f)
    }
    requestAnimationFrame(f)
  }, [inView, to, decimals])
  return <span ref={ref}>{decimals>0?v.toFixed(decimals):v.toLocaleString('pt-PT')}{suffix}</span>
}

const STATS = [
  { to:500,  suffix:'+',   decimals:0, label:'Clientes satisfeitos', sub:'em Lisboa' },
  { to:4.9,  suffix:'',    decimals:1, label:'Avaliação Google',      sub:'★★★★★' },
  { to:3,    suffix:' anos', decimals:0, label:'De experiência',       sub:'no mercado' },
  { to:100,  suffix:'%',   decimals:0, label:'Satisfação garantida',  sub:'ou repetimos grátis' },
]

export default function Stats() {
  return (
    <section className="py-20 bg-[#0f172a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04] rounded-3xl overflow-hidden">
          {STATS.map((s,i) => (
            <motion.div key={s.label}
              initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ duration:0.55, delay:i*0.08 }}
              className="bg-[#0f172a] p-10 text-center hover:bg-sky-600/5 transition-colors duration-300"
            >
              <div className="font-display font-extrabold text-sky-400 mb-2"
                style={{ fontSize:'clamp(2.2rem,4vw,3rem)' }}>
                <Counter to={s.to} suffix={s.suffix} decimals={s.decimals}/>
              </div>
              <div className="font-sans text-white/60 text-sm mb-1">{s.label}</div>
              <div className="font-sans text-white/25 text-xs">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
