'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Flame, ChefHat, Fish, ArrowRight } from 'lucide-react'

const SPECIALS = [
  {
    Icon: ChefHat,
    number: '01',
    name: 'Feijoada Completa',
    desc: 'A rainha da culinária brasileira. Feijão preto cozido lentamente com costelinha, paio, linguiça, arroz, couve refogada, farofa crocante e laranja. Servida todos os dias.',
    price: '€13.50',
    tag: 'Todos os dias',
    highlight: true,
    img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=700&q=80&auto=format&fit=crop',
  },
  {
    Icon: Flame,
    number: '02',
    name: 'Picanha na Chapa',
    desc: 'O corte mais icónico do Brasil, grelhado no ponto certo. Mal passada, ao ponto ou bem passada — acompanhada de arroz, feijão e farofa dourada.',
    price: '€14.00',
    tag: 'Mais pedido',
    highlight: false,
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=700&q=80&auto=format&fit=crop',
  },
  {
    Icon: Fish,
    number: '03',
    name: 'Moqueca Baiana',
    desc: 'Peixe fresco no leite de coco, dendê e coentros — a essência da Bahia num prato. Servido com arroz branco e pirão feito na hora.',
    price: '€13.00',
    tag: 'Especialidade',
    highlight: false,
    img: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=700&q=80&auto=format&fit=crop',
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
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative overflow-hidden border transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#00a651]/10 ${
                s.highlight ? 'border-[#00a651]/60' : 'border-white/[0.08] hover:border-[#00a651]/30'
              }`}
            >
              {/* Specialty badge */}
              {s.highlight && (
                <div className="absolute top-4 left-4 z-20 bg-[#00a651] font-sans text-[9px] tracking-[0.2em] uppercase text-white px-3 py-1.5 shadow-lg">
                  ★ Especialidade da Casa
                </div>
              )}

              {/* Photo header */}
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={s.img}
                  alt={s.name}
                  fill
                  className="object-cover brightness-75 group-hover:scale-105 group-hover:brightness-85 transition-all duration-700"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f08] via-[#0a0f08]/20 to-transparent" />

                {/* Decorative number */}
                <div className="absolute bottom-3 right-4 font-serif text-6xl font-bold text-white/10 leading-none select-none">
                  {s.number}
                </div>
              </div>

              {/* Content */}
              <div className="p-7 bg-[#0d150c]">
                {/* Icon + name row */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-11 h-11 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    s.highlight ? 'bg-[#00a651]' : 'bg-[#00a651]/15 group-hover:bg-[#00a651]/25 transition-colors duration-300'
                  }`}>
                    <s.Icon className={`w-5 h-5 ${s.highlight ? 'text-white' : 'text-[#00a651]'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#00a651] transition-colors duration-300 leading-tight">
                      {s.name}
                    </h3>
                    <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#FFD700]/70 mt-1 inline-block">
                      {s.tag}
                    </span>
                  </div>
                  <div className="font-serif text-[#00a651] text-2xl font-bold flex-shrink-0">{s.price}</div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/[0.06] mb-4" />

                {/* Description */}
                <p className="font-sans text-white/45 text-sm leading-relaxed mb-5">{s.desc}</p>

                {/* CTA link */}
                <a href="#contacto"
                  className="flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-[#00a651]/60 group-hover:text-[#00a651] transition-colors duration-300">
                  Reservar <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
