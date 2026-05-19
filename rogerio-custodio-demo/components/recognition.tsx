'use client'

import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, margin: '-80px' }

const BADGES = [
  {
    src: 'https://rogeriocustodio.pt/images/static/PME_Lider24.png',
    alt: 'PME Líder 2024',
    title: 'PME Líder 2024',
    body: 'Estatuto atribuído pelo IAPMEI a empresas com perfil económico-financeiro superior ao setor.',
  },
  {
    src: 'https://rogeriocustodio.pt/images/static/PME_Excelencia24.png',
    alt: 'PME Excelência 2024',
    title: 'PME Excelência 2024',
    body: 'Distinção máxima do IAPMEI — atribuída a uma fração das PME já com estatuto de Líder.',
  },
  {
    src: 'https://rogeriocustodio.pt/images/static/portugal2020.png',
    alt: 'Portugal 2020',
    title: 'Portugal 2020',
    body: 'Beneficiários do programa de financiamento europeu para modernização de PMEs.',
  },
]

export default function Recognition() {
  return (
    <section className="relative bg-rc-panel border-y border-rc-line2/60 overflow-hidden">
      {/* Soft grain on cream panel */}
      <div className="absolute inset-0 wood-grain opacity-[0.05] pointer-events-none" />

      <div className="container-rc relative py-16 md:py-24">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="max-w-2xl mx-auto text-center mb-14 md:mb-20"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
            }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <motion.span
              variants={{
                hidden: { scaleX: 0 },
                visible: { scaleX: 1, transition: { duration: 1, ease: EASE } },
              }}
              className="rule"
            />
            <span className="eyebrow">Reconhecimento</span>
            <motion.span
              variants={{
                hidden: { scaleX: 0 },
                visible: { scaleX: 1, transition: { duration: 1, ease: EASE } },
              }}
              className="rule"
            />
          </motion.div>
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 28 },
              visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE } },
            }}
            className="font-display text-3xl md:text-4xl text-rc-ink leading-[1.1]"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 60' }}
          >
            Certificada pelo IAPMEI.
            <span className="block italic text-rc-gold mt-1">Financiada por Portugal 2020.</span>
          </motion.h2>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
            }}
            className="mt-6 text-rc-body leading-relaxed"
          >
            Distinguida com os estatutos de <strong className="text-rc-ink">PME Líder</strong> e{' '}
            <strong className="text-rc-ink">PME Excelência</strong> — atribuídos pelo IAPMEI a empresas
            com desempenho económico-financeiro superior à média do setor.
          </motion.p>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rc-line2/60 border border-rc-line2/60 max-w-5xl mx-auto"
        >
          {BADGES.map((b, i) => (
            <motion.div
              key={b.alt}
              variants={{
                hidden: { opacity: 0, y: 28 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
              }}
              className="group bg-rc-panel p-8 md:p-10 flex flex-col items-center text-center transition-colors duration-500 hover:bg-rc-surface"
            >
              {/* Tiny ordinal marker */}
              <div className="text-[10px] uppercase tracking-[0.3em] text-rc-gold font-mono mb-6">
                №&nbsp;{String(i + 1).padStart(2, '0')}
              </div>

              {/* Badge */}
              <div className="h-28 md:h-32 flex items-center justify-center mb-6 transition-transform duration-700 group-hover:scale-[1.04]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.src}
                  alt={b.alt}
                  loading="lazy"
                  className="max-h-full w-auto object-contain"
                />
              </div>

              {/* Caption */}
              <h3 className="font-display text-xl md:text-2xl text-rc-ink italic leading-tight" style={{ fontVariationSettings: '"opsz" 144, "wght" 500' }}>
                {b.title}
              </h3>
              <p className="mt-3 text-sm text-rc-body leading-relaxed max-w-xs">
                {b.body}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 1, ease: EASE, delay: 0.6 }}
          className="text-center text-[10px] uppercase tracking-[0.3em] text-rc-muted font-mono mt-10"
        >
          <span className="text-rc-gold">✦</span>&nbsp;&nbsp; Distinções atribuídas em 2024 &nbsp;·&nbsp; Estatuto renovado anualmente &nbsp;·&nbsp; Verificável em iapmei.pt
        </motion.p>
      </div>
    </section>
  )
}
