'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

/* ─────────────────────────────────────────────────────────
   Each layer = same image, different clip-path region.
   Since the image has pure #000 background matching the
   hero, stacked clipped copies blend seamlessly.
───────────────────────────────────────────────────────── */

const IMG = {
  src: '/cocktail-hero.png',
  alt: 'Cosmopolitan cocktail',
  fill: true as const,
  quality: 95,
  priority: true,
  style: {
    objectFit: 'cover' as const,
    objectPosition: '60% center',
  },
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap')
      if (!sectionRef.current) return

      /* ── Text starts hidden ── */
      gsap.set(['.h-line-1','.h-line-2','.h-line-3','.h-desc','.h-ctas'],
        { opacity: 0, y: 28 })

      const tl = gsap.timeline()

      /* ── STEP 1: Glass rises from below (0 → 1s) ── */
      tl.from('.cl-glass', {
        clipPath: 'polygon(15% 100%, 78% 100%, 78% 100%, 15% 100%)',
        opacity: 0,
        duration: 1.0,
        ease: 'power3.out',
      }, 0)

      /* ── STEP 2: Ice cubes fall from above (0.3 → 1.6s) ── */
      tl.from('.cl-ice', {
        clipPath: 'polygon(0% 0%, 68% 0%, 68% 0%, 0% 0%)',
        opacity: 0,
        duration: 1.1,
        ease: 'power2.out',
      }, 0.3)

      /* ── STEP 3: Shaker slides in from right (1.2 → 2.6s) ── */
      tl.from('.cl-shaker', {
        clipPath: 'polygon(100% 0%, 100% 0%, 100% 58%, 100% 58%)',
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out',
      }, 1.2)

      /* ── STEP 4: Pour stream reveals top → bottom (2.1 → 3s) ── */
      tl.from('.cl-stream', {
        clipPath: 'polygon(28% 18%, 62% 18%, 62% 18%, 28% 18%)',
        opacity: 0,
        duration: 0.9,
        ease: 'power1.out',
      }, 2.1)

      /* ── STEP 5: Olive slides in from right (2.8 → 3.5s) ── */
      tl.from('.cl-olive', {
        clipPath: 'polygon(80% 36%, 80% 36%, 80% 62%, 80% 62%)',
        opacity: 0,
        duration: 0.7,
        ease: 'back.out(1.4)',
      }, 2.8)

      /* ── Text sweeps in alongside assembly ── */
      tl.to('.h-line-1', { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, 0.15)
      tl.to('.h-line-2', { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, 0.30)
      tl.to('.h-line-3', { opacity: 1, y: 0, duration: 0.50, ease: 'power3.out' }, 0.45)
      tl.to('.h-desc',   { opacity: 1, y: 0, duration: 0.45 }, 0.65)
      tl.to('.h-ctas',   { opacity: 1, y: 0, duration: 0.45 }, 0.80)
    }
    init()
  }, [])

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden"
      style={{ background: '#000000' }}>

      {/* ── Right side: deconstructed photo layers ── */}
      <div className="absolute inset-y-0 right-0 w-[62%] overflow-hidden">

        {/* GLASS — lower center, reveals bottom→up */}
        <div className="cl-glass absolute inset-0"
          style={{ clipPath: 'polygon(15% 36%, 78% 36%, 78% 100%, 15% 100%)' }}>
          <Image {...IMG} />
        </div>

        {/* ICE CUBES — upper left area, reveals top→down (falling) */}
        <div className="cl-ice absolute inset-0"
          style={{ clipPath: 'polygon(0% 0%, 68% 0%, 68% 62%, 0% 62%)' }}>
          <Image {...IMG} />
        </div>

        {/* SHAKER — upper right, reveals right→left (enters from right) */}
        <div className="cl-shaker absolute inset-0"
          style={{ clipPath: 'polygon(45% 0%, 100% 0%, 100% 58%, 45% 58%)' }}>
          <Image {...IMG} />
        </div>

        {/* POUR STREAM — center arc, reveals top→bottom */}
        <div className="cl-stream absolute inset-0"
          style={{ clipPath: 'polygon(28% 18%, 62% 18%, 62% 68%, 28% 68%)' }}>
          <Image {...IMG} />
        </div>

        {/* OLIVE — right rim, slides from right */}
        <div className="cl-olive absolute inset-0"
          style={{ clipPath: 'polygon(46% 36%, 80% 36%, 80% 62%, 46% 62%)' }}>
          <Image {...IMG} />
        </div>

        {/* Gradient: left edge blends into black */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(90deg, #000 0%, #000 6%, rgba(0,0,0,0.65) 26%, rgba(0,0,0,0.1) 52%, transparent 75%)',
        }} />

        {/* Bottom vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(180deg, transparent 65%, rgba(0,0,0,0.45) 100%)',
        }} />
      </div>

      {/* ── Left: text ── */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-8 lg:px-16 flex items-center">
        <div className="w-full lg:w-[50%] flex flex-col">

          <div className="h-line-1 mb-4">
            <span className="font-display text-[9px] tracking-[0.55em] text-[#e84800]/80 uppercase">
              Underground Bar &amp; Lounge
            </span>
          </div>

          <h1 className="font-display font-bold leading-none mb-2"
            style={{ fontSize: 'clamp(3.8rem, 7vw, 7.5rem)' }}>
            <span className="h-line-2 block text-[#ede8e4]">ENTER</span>
            <span className="h-line-3 block text-[#e84800] glow-text">THE CAVE</span>
          </h1>

          <div className="h-line-3 w-10 h-px my-8"
            style={{ background: 'rgba(232,72,0,0.35)' }} />

          <p className="h-desc font-sans font-light text-white/35 leading-loose max-w-sm mb-12"
            style={{ fontSize: '0.92rem', letterSpacing: '0.025em' }}>
            Where extraordinary cocktails meet a world built beneath the streets.
            Bold flavours. Pure atmosphere.
          </p>

          <div className="h-ctas flex flex-wrap gap-4">
            <a href="#reservation"
              className="font-display text-[10px] tracking-[0.25em] uppercase px-9 py-4 bg-[#e84800] text-white hover:bg-[#ff5500] transition-colors duration-300"
              style={{ boxShadow: '0 6px 28px rgba(232,72,0,0.3)', animation: 'subtlePulse 3s ease-in-out infinite' }}>
              Reserve Now
            </a>
            <a href="#menu"
              className="font-display text-[10px] tracking-[0.25em] uppercase px-9 py-4 glass text-white/40 hover:text-white/70 transition-all duration-300">
              Explore Menu
            </a>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
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
