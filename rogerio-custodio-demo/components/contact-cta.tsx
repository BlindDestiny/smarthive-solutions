'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react'
import QuoteButton from './quote-button'
import { company } from '@/lib/content'

const EASE = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, margin: '-80px' }

export default function ContactCTA() {
  return (
    <section className="section bg-rc-bg">
      <div className="container-rc">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 1, ease: EASE }}
          className="bg-rc-graphite text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 wood-grain opacity-[0.12]" />
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 right-0 w-80 h-80 bg-rc-gold/8 rounded-full blur-3xl"
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-16 p-12 md:p-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
              className="lg:col-span-7"
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
                    visible: { scaleX: 1, transition: { duration: 1.1, ease: EASE } },
                  }}
                  style={{ transformOrigin: 'left' }}
                  className="rule-light"
                />
                <span className="eyebrow-light">Próximo passo</span>
              </motion.div>
              <motion.h2
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE } },
                }}
                className="font-display text-4xl md:text-6xl leading-[1.02]"
              >
                Tem um projeto
                <span className="block italic text-rc-goldLight">em mente?</span>
              </motion.h2>
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
                }}
                className="mt-8 text-white/75 leading-relaxed max-w-xl"
              >
                A primeira conversa é grátis e sem compromisso. Conte-nos o que tem em mente —
                e damos-lhe a nossa opinião honesta sobre o que faz sentido fazer, em que prazo
                e com que orçamento.
              </motion.p>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
                }}
                className="mt-12 flex flex-col sm:flex-row gap-4"
              >
                <QuoteButton variant="light">
                  Pedir Orçamento
                  <ArrowRight size={16} />
                </QuoteButton>
                <a href={`tel:${company.phoneTel}`} className="btn-outline-light">
                  <Phone size={14} />
                  {company.phoneDisplay}
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } } }}
              className="lg:col-span-5 lg:border-l lg:border-white/15 lg:pl-16 space-y-7 text-sm"
            >
              {[
                { icon: MapPin, label: 'Oficina', content: <div className="text-white">{company.address}</div> },
                {
                  icon: Clock,
                  label: 'Horário',
                  content: (
                    <div className="text-white leading-relaxed">
                      Seg–Sex<br />
                      <span className="text-white/70">08:30 – 13:00 · 14:00 – 16:30</span>
                    </div>
                  ),
                },
                {
                  icon: Mail,
                  label: 'Email',
                  content: (
                    <a href={`mailto:${company.emails[1].address}`} className="text-white hover:text-rc-goldLight transition-colors">
                      {company.emails[1].address}
                    </a>
                  ),
                },
              ].map(({ icon: Icon, label, content }, idx) => (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, x: 30 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } },
                  }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 border border-white/15 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-rc-goldLight" />
                  </div>
                  <div>
                    <div className="eyebrow-light mb-1">{label}</div>
                    {content}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
