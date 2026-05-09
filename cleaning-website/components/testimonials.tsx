'use client'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const REVIEWS = [
  { name:'Margarida F.',  role:'Lisboa, Residencial',  stars:5, text:'Impecável! Contratei para limpeza mensal e a atenção ao detalhe é incrível. Encontram sujidade que eu nem sabia que existia.' },
  { name:'Ricardo A.',   role:'Startup, Escritório',  stars:5, text:'A equipa é discreta, pontual e profissional. Os colegas adoraram a diferença ao entrar na segunda-feira.' },
  { name:'Ana & João',   role:'Cascais, Residencial', stars:5, text:'Limpeza pós-obra em 5 horas. Transformaram um caos de construção num apartamento pronto a entrar.' },
  { name:'Sofia M.',     role:'Lisboa, Mensal',       stars:5, text:'8 meses de plano mensal. Sempre a horas, sempre com o mesmo cuidado. Nunca precisei pedir para repetir.' },
  { name:'Pedro Costa',  role:'Restaurante, Porto',   stars:5, text:'Limpeza profunda antes da abertura. Os inspetores sanitários ficaram impressionados.' },
  { name:'Inês Lopes',   role:'Lisboa, Mudanças',     stars:5, text:'Mudança de casa + limpeza de entrada. Serviço fantástico, preço justo. Já recomendei a 4 amigas.' },
  { name:'Carlos R.',    role:'Clínica, Lisboa',      stars:5, text:'Para uma clínica médica a higiene é crítica. A SparkClean entende isso e usa os protocolos correctos.' },
  { name:'Beatriz N.',   role:'Escritório, Sintra',   stars:5, text:'Excelente relação qualidade-preço. Migramos de outra empresa e a diferença é notável.' },
]
const ROW2 = [...REVIEWS].reverse()

function Card({ r }: { r:typeof REVIEWS[0] }) {
  return (
    <div className="flex-shrink-0 w-[300px] bg-white border border-slate-100 rounded-2xl p-6 mx-3 hover:border-sky-200 hover:shadow-md hover:shadow-sky-50 transition-all duration-300 whitespace-normal align-top">
      <div className="flex gap-0.5 mb-3">
        {Array.from({length:r.stars}).map((_,i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400"/>)}
      </div>
      <p className="font-sans text-slate-500 text-sm leading-relaxed mb-4 break-words">"{r.text}"</p>
      <div>
        <div className="font-display font-bold text-slate-900 text-sm">{r.name}</div>
        <div className="font-sans text-slate-400 text-xs mt-0.5">{r.role}</div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-28 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-14">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <motion.span initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              className="inline-block badge-light text-sky-700 font-sans text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              Opiniões reais
            </motion.span>
            <motion.h2 initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ duration:0.65 }}
              className="font-display font-extrabold text-slate-900" style={{ fontSize:'clamp(1.9rem,3.5vw,2.8rem)' }}>
              Mais de 500 famílias<br/>confiam em nós
            </motion.h2>
          </div>
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            className="flex items-center gap-4 card rounded-2xl px-6 py-4">
            <div className="text-center">
              <div className="font-display font-extrabold text-sky-600 text-3xl">4.9</div>
              <div className="flex gap-0.5 justify-center mt-1">
                {[1,2,3,4,5].map(i=><Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400"/>)}
              </div>
            </div>
            <div className="w-px h-8 bg-slate-100"/>
            <div>
              <div className="font-display font-bold text-slate-900">287 opiniões</div>
              <div className="font-sans text-slate-400 text-xs">Google Reviews</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="marquee-wrap mb-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...REVIEWS,...REVIEWS].map((r,i) => <Card key={i} r={r}/>)}
        </div>
      </div>
      <div className="marquee-wrap overflow-hidden">
        <div className="flex animate-marquee2 whitespace-nowrap">
          {[...ROW2,...ROW2].map((r,i) => <Card key={i} r={r}/>)}
        </div>
      </div>
    </section>
  )
}
