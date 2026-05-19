'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { services } from '@/lib/content'

const EASE = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, margin: '-80px' }

export default function ServicesSection() {
  return (
    <section className="section bg-rc-surface">
      <div className="container-rc">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
        >
          <div className="max-w-2xl">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
              }}
              className="flex items-center gap-3 mb-5"
            >
              <motion.span
                variants={{
                  hidden: { scaleX: 0 },
                  visible: { scaleX: 1, transition: { duration: 1.1, ease: EASE } },
                }}
                style={{ transformOrigin: 'left' }}
                className="rule"
              />
              <span className="eyebrow">O que fazemos</span>
            </motion.div>
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 28 },
                visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE } },
              }}
              className="font-display text-4xl md:text-5xl text-rc-ink leading-[1.05]"
            >
              Seis áreas de
              <span className="italic text-rc-gold"> excelência.</span>
            </motion.h2>
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
              }}
              className="mt-6 text-rc-body leading-relaxed"
            >
              Cada projeto é único — mas a abordagem é sempre a mesma: análise técnica
              cuidada, materiais escolhidos a dedo, execução com tempo, e instalação por
              equipa própria.
            </motion.p>
          </div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
            }}
          >
            <Link
              href="/servicos"
              className="text-[11px] uppercase tracking-widest3 text-rc-ink hover:text-rc-gold inline-flex items-center gap-2 transition-colors self-start md:self-end group"
            >
              Ver todos os serviços
              <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.slug}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
                }}
                whileHover={{ y: -6, transition: { duration: 0.5, ease: EASE } }}
              >
                <Link
                  href={`/servicos#${s.slug}`}
                  className="group bg-rc-surface overflow-hidden border border-rc-line block h-full"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${s.image}')` }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 1.2, ease: EASE }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-rc-ink/55 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/95 text-rc-ink text-[10px] uppercase tracking-widest3 font-medium">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="w-11 h-11 bg-rc-surface/95 flex items-center justify-center">
                        <Icon size={20} className="text-rc-gold" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="font-display text-2xl text-rc-ink leading-tight">{s.title}</h3>
                    <p className="mt-3 text-sm text-rc-body leading-relaxed">{s.short}</p>
                    <div className="mt-6 flex items-center gap-2 text-[11px] uppercase tracking-widest3 text-rc-muted group-hover:text-rc-gold transition-colors">
                      Saber mais
                      <ArrowUpRight size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
