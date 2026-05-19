'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const EASE = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, margin: '-80px' }

export default function Story() {
  return (
    <section className="section bg-rc-bg">
      <div className="container-rc grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Photo composition */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.18 } },
          }}
          className="lg:col-span-6 order-2 lg:order-1"
        >
          <div className="relative">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.98 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.1, ease: EASE } },
              }}
              className="aspect-[4/5] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1567016526105-22da7c13161a?auto=format&fit=crop&w=1400&q=85')",
              }}
            />
            <motion.div
              variants={{
                hidden: { opacity: 0, x: 40, y: 40 },
                visible: { opacity: 1, x: 0, y: 0, transition: { duration: 1.1, ease: EASE } },
              }}
              className="hidden md:block absolute -bottom-14 -right-14 w-60 h-72 bg-cover bg-center shadow-2xl"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85')",
              }}
            />
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -30, y: -30 },
                visible: { opacity: 1, x: 0, y: 0, transition: { duration: 1, ease: EASE } },
              }}
              className="hidden md:block absolute -top-6 -left-6 px-6 py-4 bg-rc-ink text-white"
            >
              <div className="eyebrow-light">Desde</div>
              <div className="font-display text-4xl mt-1">2006</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Copy */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
          }}
          className="lg:col-span-5 lg:col-start-8 order-1 lg:order-2"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
            }}
            className="flex items-center gap-3 mb-6"
          >
            <motion.span
              variants={{
                hidden: { scaleX: 0 },
                visible: { scaleX: 1, transition: { duration: 1.2, ease: EASE } },
              }}
              style={{ transformOrigin: 'left' }}
              className="rule"
            />
            <span className="eyebrow">A Nossa História</span>
          </motion.div>

          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 28 },
              visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE } },
            }}
            className="font-display text-4xl md:text-5xl text-rc-ink leading-[1.05]"
          >
            Duas décadas de
            <span className="block italic text-rc-gold mt-1">ofício, em Estoi.</span>
          </motion.h2>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
            }}
            className="mt-10 space-y-5 text-rc-body leading-relaxed"
          >
            <p>
              A <strong className="text-rc-ink">Rogério Custódio, Lda.</strong> foi fundada em 2006 em Estoi, no concelho de Faro,
              com um propósito claro: <em>fazer carpintaria como se faz desde sempre</em>, mas
              com a precisão que os projetos modernos exigem.
            </p>
            <p>
              Trabalhamos diariamente em projetos residenciais e comerciais por todo o Algarve.
              Cada peça começa com o desenho técnico no atelier, passa pela produção em oficina
              por mestres carpinteiros, e termina com a instalação ajustada ao centímetro no
              espaço do cliente.
            </p>
            <p>
              Acreditamos no <strong className="text-rc-ink">trabalho bem feito</strong> — sem atalhos, sem materiais aproximados,
              sem prazos por cumprir. É essa exigência que nos trouxe até aqui, e que nos
              continua a trazer clientes através de quem já trabalhou connosco.
            </p>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
            }}
          >
            <Link
              href="/sobre"
              className="inline-flex items-center gap-2 mt-12 text-[11px] uppercase tracking-widest3 text-rc-ink hover:text-rc-gold transition-colors group"
            >
              <span>Conhecer a oficina</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
