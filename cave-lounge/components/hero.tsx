'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import type { SiteContent } from '@/lib/content'

export default function Hero({ content = {} }: { content?: SiteContent }) {
  const sectionRef = useRef<HTMLElement>(null)

  const eyebrow  = content['hero.eyebrow']    ?? 'Underground Bar & Lounge'
  const title1   = content['hero.title1']     ?? 'ENTER'
  const title2   = content['hero.title2']     ?? 'THE CAVE'
  const subtitle = content['hero.subtitle']   ?? 'Where extraordinary cocktails meet a world built beneath the streets. Bold flavours. Pure atmosphere.'
  const cta1     = content['hero.cta_primary']    ?? 'Reserve Now'
  const cta2     = content['hero.cta_secondary']  ?? 'Explore Menu'

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap')
      if (!sectionRef.current) return
      gsap.set(['.h-line-1','.h-line-2','.h-line-3','.h-desc','.h-ctas'], { opacity: 0, y: 28 })
      gsap.timeline({ delay: 0.3 })
        .to('.h-line-1', { opacity: 1, y: 0, duration: 0.6,  ease: 'power3.out' })
        .to('.h-line-2', { opacity: 1, y: 0, duration: 0.6,  ease: 'power3.out' }, '-=0.3')
        .to('.h-line-3', { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=0.3')
        .to('.h-desc',   { opacity: 1, y: 0, duration: 0.45 }, '-=0.2')
        .to('.h-ctas',   { opacity: 1, y: 0, duration: 0.45 }, '-=0.25')
    }
    init()
  }, [])

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden"
      style={{ background: '#000000' }}>

      <div className="absolute inset-y-0 right-0 w-[62%] overflow-hidden">
        <Image
          src='/cocktail-hero.png'
          alt='Cosmopolitan cocktail'
          fill
          quality={95}
          priority
          style={{ objectFit: 'cover', objectPosition: '60% center' }}
        />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(90deg, #000 0%, #000 6%, rgba(0,0,0,0.65) 26%, rgba(0,0,0,0.1) 52%, transparent 75%)',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(180deg, transparent 65%, rgba(0,0,0,0.45) 100%)',
        }} />
      </div>

      <div className="relative z-10 h-full max-w-7xl mx-auto px-8 lg:px-16 flex items-center">
        <div className="w-full lg:w-[50%] flex flex-col">
          <div className="h-line-1 mb-4">
            <span className="font-display text-[9px] tracking-[0.55em] text-[#e84800]/80 uppercase">
              {eyebrow}
            </span>
          </div>

          <h1 className="font-display font-bold leading-none mb-2"
            style={{ fontSize: 'clamp(3.8rem, 7vw, 7.5rem)' }}>
            <span className="h-line-2 block text-[#ede8e4]">{title1}</span>
            <span className="h-line-3 block text-[#e84800] glow-text">{title2}</span>
          </h1>

          <div className="h-line-3 w-10 h-px my-8" style={{ background: 'rgba(232,72,0,0.35)' }} />

          <p className="h-desc font-sans font-light text-white/35 leading-loose max-w-sm mb-12"
            style={{ fontSize: '0.92rem', letterSpacing: '0.025em' }}>
            {subtitle}
          </p>

          <div className="h-ctas flex flex-wrap gap-4">
            <a href="#reservation"
              className="font-display text-[10px] tracking-[0.25em] uppercase px-9 py-4 bg-[#e84800] text-white hover:bg-[#ff5500] transition-colors duration-300"
              style={{ boxShadow: '0 6px 28px rgba(232,72,0,0.3)', animation: 'subtlePulse 3s ease-in-out infinite' }}>
              {cta1}
            </a>
            <a href="#menu"
              className="font-display text-[10px] tracking-[0.25em] uppercase px-9 py-4 glass text-white/40 hover:text-white/70 transition-all duration-300">
              {cta2}
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none z-20">
        <span className="font-display text-[8px] tracking-[0.55em] text-white/15 uppercase">scroll</span>
        <div style={{
          width: 1, height: 44,
          background: 'linear-gradient(180deg, rgba(232,72,0,0.5), transparent)',
          animation: 'scrollLine 2s ease-in-out infinite',
        }} />
      </div>
    </section>
  )
}
