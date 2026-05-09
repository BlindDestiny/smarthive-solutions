'use client'
import { motion } from 'framer-motion'

const REVIEWS = [
  { quote: 'Uma experiência verdadeiramente inesquecível. O menu de degustação é uma obra de arte.', name: 'Ana Ferreira', role: 'Lisboa', stars: 5 },
  { quote: 'O melhor jantar de negócios que já organizei. Serviço impecável, ambiente único.', name: 'Bruno Almeida', role: 'CEO, TechStart', stars: 5 },
  { quote: 'Fomos celebrar o nosso aniversário e superou todas as expectativas. Voltaremos sempre.', name: 'Mariana & João', role: 'Clientes regulares', stars: 5 },
  { quote: 'Os cocktails são extraordinários. O Smoked Old Fashioned é o melhor que provei em Portugal.', name: 'Pedro Costa', role: 'Porto', stars: 5 },
  { quote: 'Ambiente sofisticado sem ser pretensioso. A equipa faz-nos sentir em casa.', name: 'Sofia Lopes', role: 'Bloguer gastronómica', stars: 5 },
  { quote: 'Reservei para o aniversário da empresa — toda a equipa ficou rendida. Obrigado!', name: 'Carla Mendes', role: 'Directora RH', stars: 5 },
  { quote: 'O tártaro de atum e o wagyu são simplesmente divinos. Que Chef!', name: 'Ricardo Nunes', role: 'Chef & Crítico', stars: 5 },
  { quote: 'Jazz ao vivo + jantar de degustação = noite perfeita. Já reservei para o mês seguinte.', name: 'Isabel Santos', role: 'Lisboa', stars: 5 },
]

const ROW2 = [...REVIEWS].reverse()

function ReviewCard({ r }: { r: typeof REVIEWS[0] }) {
  return (
    <div className="flex-shrink-0 w-72 bg-[#0f0f0f] border border-white/[0.07] p-6 mx-3">
      <div className="text-gold text-sm mb-3">{'★'.repeat(r.stars)}</div>
      <p className="font-sans text-white/60 text-sm leading-relaxed mb-4">"{r.quote}"</p>
      <div>
        <div className="font-serif text-white text-sm">{r.name}</div>
        <div className="font-sans text-white/25 text-[11px] tracking-wide">{r.role}</div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="py-32 lg:py-44 bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-16">
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="flex items-center gap-4 mb-6"
        >
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold">04</span>
          <span className="w-12 h-px bg-gold/40" />
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-white/30">Testemunhos</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="font-serif font-light text-5xl md:text-6xl text-white"
        >
          O que dizem<br />
          <span className="text-gold italic">os nossos clientes</span>
        </motion.h2>
      </div>

      {/* Row 1 — left */}
      <div className="marquee-wrapper relative mb-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...REVIEWS, ...REVIEWS].map((r, i) => <ReviewCard key={i} r={r} />)}
        </div>
      </div>

      {/* Row 2 — right */}
      <div className="marquee-wrapper relative overflow-hidden">
        <div className="flex animate-marquee2 whitespace-nowrap">
          {[...ROW2, ...ROW2].map((r, i) => <ReviewCard key={i} r={r} />)}
        </div>
      </div>
    </section>
  )
}
