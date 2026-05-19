'use client'

import { motion } from 'framer-motion'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { company } from '@/lib/content'

const EASE = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, margin: '-80px' }

export default function LocationMap() {
  const mapSrc = `https://maps.google.com/maps?q=${company.mapsQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${company.mapsQuery}`

  return (
    <section className="relative bg-rc-bg">
      <div className="container-rc py-16 md:py-24">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12"
        >
          <div className="max-w-xl">
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
              <span className="eyebrow">Onde estamos</span>
            </motion.div>
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 28 },
                visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE } },
              }}
              className="font-display text-3xl md:text-5xl text-rc-ink leading-[1.05]"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 60' }}
            >
              Atelier em Estoi.
              <span className="block italic text-rc-gold mt-1">Algarve, Portugal.</span>
            </motion.h2>
          </div>

          <motion.a
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
            }}
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] uppercase tracking-widest3 text-rc-ink hover:text-rc-gold inline-flex items-center gap-2 transition-colors group"
          >
            Abrir no Google Maps
            <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </motion.a>
        </motion.div>

        {/* Map + floating info card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 1, ease: EASE }}
          className="relative h-[420px] md:h-[520px] border border-rc-line overflow-hidden"
        >
          <iframe
            title="Mapa Rogério Custódio · Estoi"
            src={mapSrc}
            className="absolute inset-0 w-full h-full"
            style={{ border: 0, filter: 'grayscale(0.55) contrast(1.05) saturate(0.9)' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Floating info card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewport}
            transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
            className="absolute top-5 left-5 md:top-8 md:left-8 bg-white/96 backdrop-blur-sm border border-rc-line shadow-xl shadow-black/15 p-5 md:p-7 max-w-[280px] md:max-w-xs"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 border border-rc-gold/50 flex items-center justify-center shrink-0">
                <MapPin size={14} className="text-rc-gold" strokeWidth={1.6} />
              </div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-rc-gold font-mono">
                Oficina · Atelier
              </div>
            </div>
            <h3 className="font-display text-xl md:text-2xl text-rc-ink leading-tight italic" style={{ fontVariationSettings: '"opsz" 144, "wght" 500' }}>
              Rogério Custódio
            </h3>
            <p className="text-sm text-rc-body mt-2 leading-relaxed">
              Sítio dos Salgados<br />
              <span className="text-rc-muted">8005-540 Faro · Algarve</span>
            </p>
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-[10px] uppercase tracking-[0.3em] text-rc-gold hover:text-rc-ink transition-colors font-mono group"
            >
              <span>Ver direções</span>
              <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
