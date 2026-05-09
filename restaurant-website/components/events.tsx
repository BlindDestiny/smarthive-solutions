'use client'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const EVENTS = [
  {
    day: '16', month: 'MAI', year: '2026',
    title: 'Jazz Night — Trio Fausto',
    desc: 'Uma noite de jazz ao vivo com o aclamado Trio Fausto. Jantar à la carte disponível.',
    time: '21h30', price: '€15 entrada', tag: 'Música',
  },
  {
    day: '22', month: 'MAI', year: '2026',
    title: 'Jantar de Degustação',
    desc: '7 pratos com harmonização de vinhos selecionados pelo Sommelier Rodrigo Alves.',
    time: '20h00', price: '€110 / pax', tag: 'Gastronomia',
  },
  {
    day: '29', month: 'MAI', year: '2026',
    title: 'Cocktail Masterclass',
    desc: 'Aprenda a criar 4 cocktails da nossa carta com o Head Bartender Diogo Ferreira.',
    time: '19h00', price: '€65 / pax', tag: 'Experiência',
  },
  {
    day: '05', month: 'JUN', year: '2026',
    title: 'Noite de Vinhos Verdes',
    desc: 'Vertical de vinhos verdes premium, harmonizados com tapas da casa. Com sommelier.',
    time: '20h30', price: '€55 / pax', tag: 'Vinhos',
  },
]

export default function Events() {
  return (
    <section id="events" className="py-32 lg:py-44 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="flex items-center gap-4 mb-6"
        >
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold">03</span>
          <span className="w-12 h-px bg-gold/40" />
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-white/30">Agenda</span>
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif font-light text-5xl md:text-6xl text-white"
          >
            Próximos<br />Eventos
          </motion.h2>
          <motion.a
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            href="#reservar"
            className="flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-gold hover:gap-4 transition-all duration-300"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </motion.a>
        </div>

        <div className="space-y-px">
          {EVENTS.map((ev, i) => (
            <motion.div
              key={ev.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group flex items-center gap-8 py-8 border-b border-white/[0.07] hover:bg-white/[0.015] px-4 -mx-4 transition-colors duration-300 cursor-pointer"
            >
              {/* Date */}
              <div className="flex-shrink-0 w-16 text-center border-r border-white/10 pr-8">
                <div className="font-serif text-3xl text-gold font-light leading-none">{ev.day}</div>
                <div className="font-sans text-[10px] tracking-widest text-white/30 uppercase mt-1">{ev.month}</div>
              </div>

              {/* Tag */}
              <div className="hidden md:block flex-shrink-0">
                <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-gold/60 border border-gold/20 px-2.5 py-1">
                  {ev.tag}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-serif text-xl text-white group-hover:text-gold transition-colors duration-300 mb-1">
                  {ev.title}
                </div>
                <div className="font-sans text-white/30 text-sm leading-relaxed line-clamp-1">{ev.desc}</div>
              </div>

              {/* Time + Price */}
              <div className="hidden lg:flex flex-col items-end gap-1 flex-shrink-0">
                <div className="font-sans text-white/50 text-sm">{ev.time}</div>
                <div className="font-sans text-gold text-sm font-medium">{ev.price}</div>
              </div>

              {/* Arrow */}
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-gold group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
