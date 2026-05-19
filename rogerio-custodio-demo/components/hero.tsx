'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowDownRight } from 'lucide-react'
import QuoteButton from './quote-button'

const EASE = [0.22, 1, 0.36, 1] as const

// Vimeo background mode: autoplay + loop + muted + no UI
const VIMEO_URL =
  'https://player.vimeo.com/video/905250520?h=0a63b471dd&background=1&autoplay=1&loop=1&muted=1&controls=0&title=0&byline=0&portrait=0'

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoLayerRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const bottomBarRef = useRef<HTMLDivElement>(null)

  // GSAP ScrollTrigger — parallax video + fade-out headline + slide-out bottom bar
  useEffect(() => {
    let ctx: any
    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        if (!sectionRef.current) return

        if (videoLayerRef.current) {
          gsap.to(videoLayerRef.current, {
            yPercent: -16,
            scale: 1.05,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
            },
          })
        }

        if (headlineRef.current) {
          gsap.to(headlineRef.current, {
            yPercent: -8,
            opacity: 0.2,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.5,
            },
          })
        }

        if (bottomBarRef.current) {
          gsap.to(bottomBarRef.current, {
            yPercent: 120,
            opacity: 0,
            ease: 'power2.in',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '40% top',
              scrub: 0.5,
            },
          })
        }
      }, sectionRef)
    })()

    return () => { ctx?.revert() }
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-[100vh] flex flex-col overflow-hidden bg-rc-charcoal">
      {/* VIMEO BACKGROUND — iframe directly sized for cover; min-width/min-height force coverage */}
      <div ref={videoLayerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        <iframe
          src={VIMEO_URL}
          title="Rogério Custódio · Atelier"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute top-1/2 left-1/2 border-0"
          style={{
            width: '100vw',
            height: '56.25vw',
            minHeight: '100vh',
            minWidth: '177.78vh',
            transform: 'translate(-50%, -50%)',
            filter: 'grayscale(12%) contrast(1.08) brightness(0.65)',
          }}
        />
      </div>

      {/* DARK OVERLAYS for text contrast — layered */}
      <div className="absolute inset-0 bg-rc-charcoal/55 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-rc-charcoal/85 via-rc-charcoal/40 to-rc-charcoal/30 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-rc-charcoal via-rc-charcoal/80 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-rc-charcoal/70 to-transparent pointer-events-none" />

      {/* Grain */}
      <div className="absolute inset-0 wood-grain opacity-[0.14] mix-blend-overlay pointer-events-none" />

      {/* Vertical gold accent */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.6, ease: EASE, delay: 0.3 }}
        style={{ transformOrigin: 'top' }}
        className="hidden md:block absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-rc-gold/60 to-transparent z-10"
      />

      {/* MASTHEAD */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 1 }}
        className="relative z-10 pt-24 md:pt-36 px-5 md:px-12 lg:px-16"
      >
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white font-mono">
          <div className="flex items-center gap-3">
            <span className="text-rc-goldLight">№ 001</span>
            <span className="h-px w-8 bg-white/30" />
            <span>Atelier · Estoi</span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <span>Faro · Algarve</span>
            <span className="h-px w-8 bg-white/30" />
            <span className="text-rc-goldLight">Est. MMVI</span>
          </div>
        </div>
      </motion.div>

      {/* MAIN */}
      <div ref={headlineRef} className="relative z-10 flex-1 flex items-center px-5 md:px-12 lg:px-16 py-8 md:py-20">
        <div className="w-full max-w-[1320px] mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.15 } } }}
            className="max-w-3xl"
          >
            <motion.h1
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
              }}
              className="font-display text-white leading-[0.92]"
              style={{ textShadow: '0 2px 30px rgba(0,0,0,0.4)' }}
            >
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.1, ease: EASE } },
                }}
                className="block text-[clamp(2.25rem,6vw,5rem)] text-white italic font-light tracking-tight"
              >
                Carpinta&shy;ria
              </motion.span>

              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.1, ease: EASE } },
                }}
                className="block text-[clamp(1.4rem,3vw,2.4rem)] text-white italic font-light mt-1.5 md:mt-2 ml-[8%]"
              >
                &mdash; de &mdash;
              </motion.span>

              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 60, filter: 'blur(12px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.3, ease: EASE } },
                }}
                className="block text-[clamp(3.5rem,11vw,9rem)] italic text-rc-goldLight font-normal tracking-[-0.03em] mt-1 -ml-[1%]"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80, "wght" 500' }}
              >
                precisão<span className="text-rc-gold/70">.</span>
                <sup className="text-2xl md:text-3xl align-super -ml-1 text-rc-gold/60">*</sup>
              </motion.span>
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: 0.3 } },
              }}
              className="mt-6 md:mt-10 max-w-md text-[13px] md:text-sm text-white leading-relaxed font-mono"
            >
              <span className="text-rc-goldLight">*</span>&nbsp; Cozinhas, roupeiros e mobiliário por medida.
              Trabalho artesanal executado por mestres carpinteiros, em oficina própria,
              desde dois mil e seis.
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: 0.4 } },
              }}
              className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-3 md:gap-4"
            >
              <QuoteButton variant="light">
                Pedir Orçamento
                <ArrowRight size={16} />
              </QuoteButton>
              <Link href="/portefolio" className="btn-outline-light">
                Ver Portefólio
                <ArrowDownRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* RECOGNITION BADGES — desktop corner watermark, replaces rotating seal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE, delay: 1.4 }}
        className="hidden md:flex absolute z-10 bottom-24 right-8 lg:bottom-28 lg:right-12 flex-col items-end gap-2.5 pointer-events-none"
      >
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-rc-goldLight/80 font-mono">
          <span className="h-px w-7 bg-rc-goldLight/45" />
          <span>Distinções · IAPMEI · 2024</span>
        </div>
        <div className="flex items-center gap-3 lg:gap-4 bg-white/94 backdrop-blur-sm border border-white/25 px-4 py-3 shadow-2xl shadow-black/35">
          {/* eslint-disable @next/next/no-img-element */}
          <img
            src="https://rogeriocustodio.pt/images/static/PME_Lider24.png"
            alt="PME Líder 2024"
            className="h-11 lg:h-14 w-auto object-contain"
            loading="eager"
          />
          <span className="h-9 lg:h-11 w-px bg-rc-line2" aria-hidden="true" />
          <img
            src="https://rogeriocustodio.pt/images/static/PME_Excelencia24.png"
            alt="PME Excelência 2024"
            className="h-11 lg:h-14 w-auto object-contain"
            loading="eager"
          />
          <span className="h-9 lg:h-11 w-px bg-rc-line2" aria-hidden="true" />
          <img
            src="https://rogeriocustodio.pt/images/static/portugal2020.png"
            alt="Portugal 2020"
            className="h-11 lg:h-14 w-auto object-contain"
            loading="eager"
          />
          {/* eslint-enable @next/next/no-img-element */}
        </div>
      </motion.div>

      {/* RECOGNITION BADGES — mobile inline strip (below CTAs, above colophon) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 1.4 }}
        className="md:hidden relative z-10 mx-5 mb-3"
      >
        <div className="text-[9px] uppercase tracking-[0.3em] text-rc-goldLight/75 font-mono mb-2 flex items-center gap-2">
          <span className="h-px w-5 bg-rc-goldLight/40" />
          Distinções · IAPMEI 2024
        </div>
        <div className="flex items-center gap-3 bg-white/94 backdrop-blur-sm border border-white/25 px-3 py-2.5">
          {/* eslint-disable @next/next/no-img-element */}
          <img src="https://rogeriocustodio.pt/images/static/PME_Lider24.png" alt="PME Líder 2024" className="h-9 w-auto object-contain" loading="eager" />
          <span className="h-7 w-px bg-rc-line2" aria-hidden="true" />
          <img src="https://rogeriocustodio.pt/images/static/PME_Excelencia24.png" alt="PME Excelência 2024" className="h-9 w-auto object-contain" loading="eager" />
          <span className="h-7 w-px bg-rc-line2" aria-hidden="true" />
          <img src="https://rogeriocustodio.pt/images/static/portugal2020.png" alt="Portugal 2020" className="h-9 w-auto object-contain" loading="eager" />
          {/* eslint-enable @next/next/no-img-element */}
        </div>
      </motion.div>

      {/* COLOPHON — inline credits strip at bottom (replaces stats grid + prev bottom strip) */}
      <motion.div
        ref={bottomBarRef}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 1.2 }}
        className="relative z-10 px-5 md:px-12 lg:px-16 pb-5 md:pb-7 pt-2 md:pt-3"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 lg:gap-12 max-w-[80%] lg:max-w-none">
          {/* Inline colophon */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.3em] text-white font-mono">
            <span>
              <span className="text-rc-goldLight">XIX</span>
              <span className="text-white/40">/</span>
              <span className="text-white/75 normal-case tracking-normal ml-1">19 anos de ofício</span>
            </span>
            <span className="h-3 w-px bg-white/15" aria-hidden="true" />
            <span>
              <span className="text-rc-goldLight">D+</span>
              <span className="text-white/40">/</span>
              <span className="text-white/75 normal-case tracking-normal ml-1">500+ projetos no Algarve</span>
            </span>
            <span className="hidden lg:inline h-3 w-px bg-white/15" aria-hidden="true" />
            <span className="hidden lg:inline">
              <span className="text-rc-goldLight">MMVI</span>
              <span className="text-white/40">/</span>
              <span className="text-white/75 normal-case tracking-normal ml-1">fundado em Estoi</span>
            </span>
          </div>

          {/* Scroll cue */}
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/45 font-mono shrink-0"
          >
            <span>Scroll para descobrir</span>
            <span className="w-px h-4 bg-rc-goldLight/60" />
          </motion.div>
        </div>
      </motion.div>

      {/* Gold rule at bottom */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.8, ease: EASE, delay: 0.5 }}
        className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-rc-gold/50 to-transparent z-10"
      />
    </section>
  )
}
