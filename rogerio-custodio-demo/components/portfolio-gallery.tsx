'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { portfolio, portfolioCategories, type PortfolioItem } from '@/lib/content'

const EASE = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, margin: '-80px' }

export default function PortfolioGallery({ showFilters = true, limit }: { showFilters?: boolean; limit?: number }) {
  const [filter, setFilter] = useState<PortfolioItem['category'] | 'all'>('all')
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null)

  const filtered = filter === 'all'
    ? portfolio
    : portfolio.filter((p) => p.category === filter)

  const items = limit ? filtered.slice(0, limit) : filtered

  return (
    <section className="section bg-rc-bg">
      <div className="container-rc">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12"
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
              <span className="eyebrow">Portefólio</span>
            </motion.div>
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 28 },
                visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE } },
              }}
              className="font-display text-4xl md:text-5xl text-rc-ink leading-[1.05]"
            >
              Trabalhos
              <span className="italic text-rc-gold"> recentes.</span>
            </motion.h2>
          </div>

          {limit && (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
              }}
            >
              <Link href="/portefolio" className="text-[11px] uppercase tracking-widest3 text-rc-ink hover:text-rc-gold inline-flex items-center gap-2 transition-colors self-start md:self-end group">
                Ver portefólio completo
                <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </motion.div>
          )}
        </motion.div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex flex-wrap items-center gap-2 mb-12"
          >
            {portfolioCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value as any)}
                className={`relative px-5 py-2.5 text-[11px] uppercase tracking-widest3 transition-colors duration-300 ${
                  filter === cat.value
                    ? 'text-white'
                    : 'text-rc-muted border border-rc-line hover:border-rc-ink hover:text-rc-ink'
                }`}
              >
                {filter === cat.value && (
                  <motion.span
                    layoutId="portfolio-pill"
                    className="absolute inset-0 bg-rc-ink"
                    transition={{ type: 'spring', stiffness: 400, damping: 38 }}
                  />
                )}
                <span className="relative">{cat.label}</span>
              </button>
            ))}
          </motion.div>
        )}

        <LayoutGroup>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {items.map((p) => (
                <motion.article
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  whileHover={{ y: -6 }}
                  onClick={() => setLightbox(p)}
                  className="group cursor-pointer overflow-hidden bg-rc-surface"
                >
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${p.image}')` }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 1.2, ease: EASE }}
                    />
                    <div className="absolute inset-0 bg-rc-ink/0 group-hover:bg-rc-ink/35 transition-colors duration-500" />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    >
                      <div className="w-11 h-11 bg-white/95 flex items-center justify-center">
                        <ArrowUpRight size={18} className="text-rc-ink" />
                      </div>
                    </motion.div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest3 text-rc-muted">
                      <span>{portfolioCategories.find((c) => c.value === p.category)?.label}</span>
                      <span>{p.year}</span>
                    </div>
                    <h3 className="font-display text-xl text-rc-ink mt-2 leading-tight">{p.title}</h3>
                    <p className="text-xs text-rc-muted mt-2">{p.location}</p>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {items.length === 0 && (
          <p className="text-center py-20 text-rc-muted">Sem projetos nesta categoria.</p>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8"
            onClick={() => setLightbox(null)}
          >
            <div className="absolute inset-0 bg-rc-ink/90" />
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightbox(null)}
                aria-label="Fechar"
                className="absolute -top-4 right-0 -translate-y-full md:translate-y-0 md:-top-2 md:-right-12 w-10 h-10 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
              <div
                className="aspect-[16/10] bg-cover bg-center"
                style={{ backgroundImage: `url('${lightbox.image}')` }}
              />
              <div className="bg-rc-surface p-8 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest3 text-rc-muted mb-1">
                    <span>{portfolioCategories.find((c) => c.value === lightbox.category)?.label}</span>
                    <span>·</span>
                    <span>{lightbox.year}</span>
                    <span>·</span>
                    <span>{lightbox.location}</span>
                  </div>
                  <h3 className="font-display text-2xl text-rc-ink">{lightbox.title}</h3>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
