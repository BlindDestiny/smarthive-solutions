'use client'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const REVIEWS = [
  { name:'Margarida F.',  role:'Lisboa, Residencial',   rating:5, text:'Impecável! Contratei para limpeza mensal e nunca mais quero outra empresa. A atenção ao detalhe é incrível — encontram sujidade que eu nem sabia que existia.' },
  { name:'Ricardo A.',   role:'Startup, Escritório',   rating:5, text:'A SparkClean transforma o nosso espaço de trabalho. A equipa é discreta, pontual e profissional. Os colegas adoraram a diferença ao entrar na segunda-feira.' },
  { name:'Ana & João',   role:'Apartamento, Cascais',  rating:5, text:'Fizemos limpeza pós-obra e ficámos de boca aberta. Em 5 horas transformaram um caos de construção num apartamento pronto a entrar.' },
  { name:'Sofia M.',     role:'Lisboa, Residencial',   rating:5, text:'Uso o plano mensal há 8 meses. Sempre a horas, sempre com o mesmo cuidado. Nunca precisei de pedir para repetir nada — fazem bem à primeira.' },
  { name:'Pedro Costa',  role:'Restaurante, Porto',    rating:5, text:'Limpeza profunda do restaurante antes da abertura. Profissionalismo total. Os inspetores sanitários ficaram impressionados.' },
  { name:'Inês Lopes',   role:'Lisboa, Residencial',   rating:5, text:'Mudança de casa + limpeza de entrada no novo apartamento. Serviço fantástico, preço justo. Já recomendei a 4 amigas.' },
  { name:'Carlos R.',    role:'Clínica, Lisboa',        rating:5, text:'Para uma clínica médica, a higiene é crítica. A SparkClean entende isso e usa os protocolos correctos. Total confiança.' },
  { name:'Beatriz N.',   role:'Escritório, Sintra',    rating:5, text:'Excelente relação qualidade-preço. Migramos de outra empresa e a diferença é notável. Recomendo sem hesitar.' },
]

const ROW2 = [...REVIEWS].reverse()

function Card({ r }: { r:typeof REVIEWS[0] }) {
  return (
    <div className="flex-shrink-0 w-80 card-glass rounded-2xl p-6 mx-3 hover:border-sky-500/20 transition-all duration-300 whitespace-normal align-top group">
      <Quote className="w-6 h-6 text-sky-500/30 mb-3 group-hover:text-sky-500/50 transition-colors"/>
      <p className="font-sans text-white/55 text-sm leading-relaxed mb-5 break-words">"{r.text}"</p>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-display font-bold text-white text-sm">{r.name}</div>
          <div className="font-sans text-white/30 text-xs mt-0.5">{r.role}</div>
        </div>
        <div className="flex gap-0.5">
          {Array.from({length:r.rating}).map((_,i) => (
            <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400"/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-32 bg-[#060915] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-3 py-1.5 mb-5"
            >
              <Star className="w-3 h-3 text-sky-400 fill-sky-400"/>
              <span className="font-sans text-sky-300 text-xs tracking-wide">O que dizem os clientes</span>
            </motion.div>
            <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ duration:0.7 }}
              className="font-display font-extrabold text-white" style={{ fontSize:'clamp(1.9rem,3.5vw,2.8rem)' }}>
              Mais de 500 famílias<br/>
              <span className="gradient-text">confiam em nós</span>
            </motion.h2>
          </div>
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            className="flex items-center gap-4 card-glass rounded-2xl px-6 py-4"
          >
            <div className="text-center">
              <div className="font-display font-extrabold text-white text-4xl gradient-text">4.9</div>
              <div className="flex gap-0.5 justify-center mt-1">
                {[1,2,3,4,5].map(i=><Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400"/>)}
              </div>
            </div>
            <div className="w-px h-10 bg-white/10"/>
            <div>
              <div className="font-display font-bold text-white">287 opiniões</div>
              <div className="font-sans text-white/30 text-xs">Google Reviews</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="marquee-wrap mb-4 overflow-hidden">
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
