'use client'
import { motion } from 'framer-motion'

const SPECIALS = [
  {
    emoji: '🫘',
    name: 'Feijoada Completa',
    desc: 'A rainha da culinária brasileira. Feijão preto cozido lentamente com costelinha de porco, paio, linguiça, acompanhado de arroz, couve refogada, farofa crocante e laranja. Todos os dias.',
    price: '€13.50',
    tag: 'Todos os dias',
    highlight: true,
  },
  {
    emoji: '🥩',
    name: 'Picanha na Chapa',
    desc: 'Picanha brasileira grelhada no ponto certo — mal passada, ao ponto ou bem passada. Servida com arroz, feijão e farofa. O corte mais pedido do Brasil, agora no Porto.',
    price: '€14.00',
    tag: 'Mais pedido',
    highlight: false,
  },
  {
    emoji: '🐟',
    name: 'Moqueca Baiana',
    desc: 'Peixe fresco cozido no leite de coco com dendê, coentros, tomate e pimentos — a essência da Bahia. Servido com arroz branco e pirão.',
    price: '€13.00',
    tag: 'Especialidade',
    highlight: false,
  },
]

export default function Specials() {
  return (
    <section className="py-32 lg:py-44 bg-[#0a0f08]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="flex items-center gap-4 mb-6"
        >
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#00a651]">03</span>
          <span className="w-12 h-px bg-[#00a651]/40" />
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-white/30">Destaque</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="font-serif font-bold text-5xl md:text-6xl text-white mb-16"
        >
          Os nossos<br />
          <span className="text-[#00a651]">Pratos de Eleição</span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {SPECIALS.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={`relative p-8 border transition-all duration-300 group cursor-default ${
                s.highlight
                  ? 'border-[#00a651] bg-[#00a651]/5'
                  : 'border-white/[0.08] bg-white/[0.02] hover:border-[#00a651]/40'
              }`}
            >
              {s.highlight && (
                <div className="absolute -top-3 left-6 bg-[#00a651] font-sans text-[10px] tracking-widest uppercase text-white px-3 py-1">
                  ★ Especialidade da Casa
                </div>
              )}
              <div className="text-4xl mb-5">{s.emoji}</div>
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-serif text-2xl text-white group-hover:text-[#00a651] transition-colors">{s.name}</h3>
                <span className="font-serif text-[#00a651] text-xl font-semibold flex-shrink-0 ml-3">{s.price}</span>
              </div>
              <span className="inline-block font-sans text-[9px] tracking-widest uppercase text-[#FFD700] border border-[#FFD700]/30 px-2 py-0.5 mb-4">
                {s.tag}
              </span>
              <p className="font-sans text-white/40 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
