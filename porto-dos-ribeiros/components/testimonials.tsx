'use client'
import { motion } from 'framer-motion'

const REVIEWS = [
  { quote: 'From the very first visit, this Brazilian restaurant completely stole our hearts. It\'s not just a place to eat — it feels like family.', name: 'Max D.', role: 'Google Review', stars: 5, lang: '🇬🇧' },
  { quote: 'Very nice Brazilian food. We tried the stroganoff and feijoada — both were very good and presented nicely. Owners and servers are so attentive.', name: 'Marilynn', role: 'Google Review', stars: 5, lang: '🇺🇸' },
  { quote: 'We were lucky to stumble across this place. It\'s easy to get tired of the same menu in Porto — this place was a breath of fresh air!', name: 'Natalie T.', role: 'Google Review', stars: 5, lang: '🇬🇧' },
  { quote: 'A feijoada é incrível! Sou brasileiro e este lugar traz-me de volta a casa. Recomendo a toda a gente que visita o Porto.', name: 'Carlos M.', role: 'Google Review', stars: 5, lang: '🇧🇷' },
  { quote: 'Atmosphere is warm and welcoming. The caipirinha is perfect and the picanha is absolutely divine. Will definitely return!', name: 'Sophie L.', role: 'Google Review', stars: 5, lang: '🇫🇷' },
  { quote: 'Melhor comida brasileira fora do Brasil. A picanha e o pão de queijo são uma maravilha. Serviço impecável e preços muito justos.', name: 'Ana P.', role: 'Google Review', stars: 5, lang: '🇵🇹' },
  { quote: 'Outstanding! The feijoada brought back memories of Rio. Fantastic value, generous portions and an incredibly friendly team.', name: 'James R.', role: 'Google Review', stars: 5, lang: '🇬🇧' },
  { quote: 'Ontem fomos jantar e foi uma experiência fantástica. O moqueca e o brigadeiro são de outro mundo. Voltamos com certeza!', name: 'Inês F.', role: 'Google Review', stars: 5, lang: '🇵🇹' },
]

const ROW2 = [...REVIEWS].reverse()

function Card({ r }: { r: typeof REVIEWS[0] }) {
  return (
    <div className="flex-shrink-0 w-72 bg-[#0f1a0e] border border-white/[0.07] p-6 mx-3 hover:border-[#00a651]/30 transition-colors duration-300 whitespace-normal align-top">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[#FFD700] text-sm">{'★'.repeat(r.stars)}</div>
        <span className="text-lg">{r.lang}</span>
      </div>
      <p className="font-sans text-white/60 text-sm leading-relaxed mb-4 break-words">"{r.quote}"</p>
      <div>
        <div className="font-serif text-white text-sm font-semibold">{r.name}</div>
        <div className="font-sans text-white/25 text-[10px] tracking-wide mt-0.5">{r.role}</div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="py-32 lg:py-44 bg-[#060c05] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-16">
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="flex items-center gap-4 mb-6"
        >
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#00a651]">04</span>
          <span className="w-12 h-px bg-[#00a651]/40" />
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-white/30">Opiniões</span>
        </motion.div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.h2
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="font-serif font-bold text-5xl md:text-6xl text-white"
          >
            287 razões<br />
            <span className="text-[#00a651]">para nos visitar</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="flex items-center gap-3 bg-[#00a651]/10 border border-[#00a651]/30 px-5 py-3"
          >
            <span className="text-[#FFD700] text-xl">★★★★★</span>
            <div>
              <div className="font-serif text-white text-xl font-bold">4.7 / 5</div>
              <div className="font-sans text-white/40 text-xs">287 opiniões · Google</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="marquee-wrapper mb-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...REVIEWS, ...REVIEWS].map((r, i) => <Card key={i} r={r} />)}
        </div>
      </div>
      <div className="marquee-wrapper overflow-hidden">
        <div className="flex animate-marquee2 whitespace-nowrap">
          {[...ROW2, ...ROW2].map((r, i) => <Card key={i} r={r} />)}
        </div>
      </div>
    </section>
  )
}
