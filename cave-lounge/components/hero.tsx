'use client'
import { useEffect, useRef } from 'react'

/* ─── Ember particle ─────────────────────────────────────── */
function Ember({ style }: { style: React.CSSProperties }) {
  return (
    <div className="absolute rounded-full pointer-events-none"
      style={{ width: 3, height: 3, background: 'rgba(232,72,0,0.7)', ...style }} />
  )
}

/* ─── The 3D Cocktail ────────────────────────────────────── */
function Cocktail() {
  return (
    <div className="relative" style={{ width: 340, height: 500 }}>

      {/* ── ambient ground glow ── */}
      <div className="c-glow absolute" style={{
        width: 280, height: 90,
        bottom: 40, left: '50%', transform: 'translateX(-50%)',
        background: 'radial-gradient(ellipse, rgba(232,72,0,0.45) 0%, transparent 70%)',
        filter: 'blur(22px)',
        pointerEvents: 'none',
      }} />

      {/* ── smoke wisp B (back) ── */}
      <div className="c-smoke-2 absolute" style={{
        width: 70, height: 110,
        top: 55, left: '58%',
        background: 'radial-gradient(ellipse at bottom, rgba(255,90,20,0.18), transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(14px)',
        animation: 'smokeFloat 4.5s ease-in-out 0.3s infinite',
      }} />

      {/* ── smoke wisp A (front) ── */}
      <div className="c-smoke-1 absolute" style={{
        width: 55, height: 90,
        top: 68, left: '38%',
        background: 'radial-gradient(ellipse at bottom, rgba(255,70,10,0.14), transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(12px)',
        animation: 'smokeFloat 3.8s ease-in-out infinite',
      }} />

      {/* ── garnish: orange wheel + flame ── */}
      <div className="c-garnish absolute" style={{
        top: 142, left: '63%',
        zIndex: 12,
        filter: 'drop-shadow(0 0 12px rgba(255,140,0,0.8))',
      }}>
        {/* orange wheel */}
        <div style={{
          width: 52, height: 52,
          borderRadius: '50%',
          background: 'conic-gradient(#ff8800 0deg,#ffcc00 36deg,#ff6600 72deg,#ffaa00 108deg,#ff8800 144deg,#ffcc00 180deg,#ff6600 216deg,#ffaa00 252deg,#ff8800 288deg,#ffcc00 324deg,#ff8800 360deg)',
          border: '2.5px solid rgba(255,180,0,0.7)',
          position: 'relative',
          boxShadow: '0 0 18px rgba(255,140,0,0.5)',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            background: 'repeating-conic-gradient(rgba(255,255,255,0.15) 0deg 10deg, transparent 10deg 36deg)',
          }} />
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 17, height: 17, borderRadius: '50%',
            background: '#ff4400',
            boxShadow: '0 0 8px rgba(255,80,0,0.9)',
          }} />
        </div>
        {/* flame above wheel */}
        <div style={{
          width: 14, height: 26,
          margin: '3px auto 0',
          background: 'linear-gradient(180deg, #ffee00 0%, #ff6600 55%, rgba(180,10,0,0.3) 100%)',
          borderRadius: '50% 50% 40% 40% / 60% 60% 40% 40%',
          filter: 'blur(0.5px)',
          boxShadow: '0 0 14px rgba(255,200,0,0.9), 0 0 28px rgba(255,80,0,0.5)',
          animation: 'flicker 1.8s ease-in-out infinite',
        }} />
      </div>

      {/* ── straw ── */}
      <div className="c-straw absolute" style={{
        width: 9, height: 175,
        top: 148, left: '60%',
        borderRadius: 5,
        background: 'linear-gradient(170deg, #ff6600 0%, #aa2200 60%, #660000 100%)',
        boxShadow: '0 0 8px rgba(232,72,0,0.5), inset 2px 0 4px rgba(255,150,50,0.3)',
        transform: 'rotate(-7deg)',
        transformOrigin: 'bottom center',
        zIndex: 11,
      }} />

      {/* ── glass back wall ── */}
      <div className="absolute" style={{
        width: 230, height: 265,
        top: 140, left: '50%', transform: 'translateX(-50%)',
        clipPath: 'polygon(6% 0%, 94% 0%, 88% 100%, 12% 100%)',
        background: 'linear-gradient(140deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 100%)',
        zIndex: 3,
      }} />

      {/* ── liquid fill (inside glass) ── */}
      <div className="c-liquid absolute" style={{
        width: 210, height: 175,
        top: 238, left: '50%', transform: 'translateX(-50%)',
        clipPath: 'polygon(5% 0%, 95% 0%, 90% 100%, 10% 100%)',
        background: 'linear-gradient(180deg, rgba(255,110,0,0.85) 0%, rgba(190,35,0,0.95) 38%, rgba(100,8,0,1) 100%)',
        boxShadow: '0 0 40px rgba(232,72,0,0.4)',
        zIndex: 4,
        overflow: 'hidden',
      }}>
        {/* surface glimmer */}
        <div style={{
          position: 'absolute', top: -1, left: 0, right: 0, height: 5,
          background: 'linear-gradient(90deg, transparent 10%, rgba(255,160,60,0.55) 50%, transparent 90%)',
          borderRadius: '50%',
        }} />
        {/* shimmer sweep */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, width: '40%',
          background: 'linear-gradient(90deg, transparent, rgba(255,180,80,0.12), transparent)',
          animation: 'liquidShimmer 3s ease-in-out infinite',
        }} />
      </div>

      {/* ── ice cube 3 (back-left) ── */}
      <div className="c-ice-3 absolute" style={{
        width: 60, height: 60,
        top: 252, left: '25%',
        borderRadius: 10,
        background: 'linear-gradient(135deg, rgba(220,240,255,0.28), rgba(180,220,255,0.14))',
        border: '1.5px solid rgba(255,255,255,0.38)',
        backdropFilter: 'blur(3px)',
        boxShadow: 'inset 3px 3px 12px rgba(255,255,255,0.18), inset -2px -2px 8px rgba(0,0,0,0.15), 0 6px 18px rgba(0,0,0,0.35)',
        transform: 'rotate(25deg)',
        zIndex: 5,
      }} />

      {/* ── ice cube 2 (back-right) ── */}
      <div className="c-ice-2 absolute" style={{
        width: 64, height: 64,
        top: 243, left: '52%',
        borderRadius: 10,
        background: 'linear-gradient(135deg, rgba(230,245,255,0.3), rgba(190,225,255,0.16))',
        border: '1.5px solid rgba(255,255,255,0.42)',
        backdropFilter: 'blur(3px)',
        boxShadow: 'inset 3px 3px 14px rgba(255,255,255,0.2), inset -2px -2px 8px rgba(0,0,0,0.12), 0 8px 22px rgba(0,0,0,0.3)',
        transform: 'rotate(-18deg)',
        zIndex: 6,
      }} />

      {/* ── ice cube 1 (front-center) ── */}
      <div className="c-ice-1 absolute" style={{
        width: 57, height: 57,
        top: 270, left: '40%',
        borderRadius: 9,
        background: 'linear-gradient(135deg, rgba(240,250,255,0.33), rgba(200,230,255,0.18))',
        border: '1.5px solid rgba(255,255,255,0.45)',
        backdropFilter: 'blur(4px)',
        boxShadow: 'inset 4px 4px 14px rgba(255,255,255,0.22), inset -2px -2px 8px rgba(0,0,0,0.15), 0 8px 22px rgba(0,0,0,0.35)',
        transform: 'rotate(12deg)',
        zIndex: 7,
      }} />

      {/* ── glass front (highlight overlay) ── */}
      <div className="c-glass absolute" style={{
        width: 230, height: 265,
        top: 140, left: '50%', transform: 'translateX(-50%)',
        clipPath: 'polygon(6% 0%, 94% 0%, 88% 100%, 12% 100%)',
        zIndex: 8,
        pointerEvents: 'none',
      }}>
        {/* left edge highlight */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '14%', bottom: 0,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)',
        }} />
        {/* right edge shadow */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '12%', bottom: 0,
          background: 'linear-gradient(270deg, rgba(255,255,255,0.06), transparent)',
        }} />
        {/* top rim */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: 'rgba(255,255,255,0.2)',
        }} />
        {/* outer border */}
        <div style={{
          position: 'absolute', inset: 0,
          clipPath: 'polygon(6% 0%, 94% 0%, 88% 100%, 12% 100%)',
          border: '1px solid rgba(255,255,255,0.14)',
        }} />
      </div>

      {/* ── glass base ── */}
      <div className="absolute" style={{
        width: 196, height: 10, bottom: 78,
        left: '50%', transform: 'translateX(-50%)',
        background: 'linear-gradient(90deg, rgba(20,10,8,0.9), rgba(50,25,20,0.7), rgba(20,10,8,0.9))',
        borderRadius: '50%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
        zIndex: 9,
      }} />

      {/* ── coaster ── */}
      <div className="absolute" style={{
        width: 238, height: 12, bottom: 66,
        left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(232,72,0,0.07)',
        border: '1px solid rgba(232,72,0,0.18)',
        borderRadius: 4,
        zIndex: 2,
      }} />
    </div>
  )
}

/* ─── Hero Section ───────────────────────────────────────── */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let ctx: { revert: () => void } | null = null

    const init = async () => {
      const { gsap }        = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      if (!sectionRef.current) return

      ctx = gsap.context(() => {
        /* ── Set everything to scattered initial state ── */
        gsap.set('.c-glass',   { y: 180, rotateX: -40, opacity: 0 })
        gsap.set('.c-liquid',  { scaleY: 0, transformOrigin: 'bottom', opacity: 0 })
        gsap.set('.c-glow',    { opacity: 0, scale: 0.2 })
        gsap.set('.c-ice-1',   { x: -340, y: -220, rotate: 140, opacity: 0 })
        gsap.set('.c-ice-2',   { x: 300,  y: -190, rotate: -95, opacity: 0 })
        gsap.set('.c-ice-3',   { x: -180, y: 260,  rotate: 210, opacity: 0 })
        gsap.set('.c-straw',   { x: 250,  y: -130, rotate: 85, opacity: 0 })
        gsap.set('.c-garnish', { y: -380, scale: 0, rotate: -200, opacity: 0 })
        gsap.set('.c-smoke-1', { opacity: 0, y: 45, scale: 0.4 })
        gsap.set('.c-smoke-2', { opacity: 0, y: 35, scale: 0.3 })
        gsap.set('.h-eyebrow', { opacity: 0, y: 30 })
        gsap.set('.h-title-1', { opacity: 0, x: -70 })
        gsap.set('.h-title-2', { opacity: 0, x: -70 })
        gsap.set('.h-desc',    { opacity: 0, y: 35 })
        gsap.set('.h-ctas',    { opacity: 0, y: 25 })

        /* ── ScrollTrigger pinned assembly timeline ── */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=220%',
            scrub: 1.4,
            pin: true,
          },
        })

        tl
          /* glass arrives first — the stage */
          .to('.c-glass',   { y: 0, rotateX: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
          .to('.c-liquid',  { scaleY: 1, opacity: 1, duration: 0.4 }, '-=0.1')
          .to('.c-glow',    { opacity: 1, scale: 1, duration: 0.4 }, '-=0.3')

          /* ice cubes fly in from different corners */
          .to('.c-ice-3',   { x: 0, y: 0, rotate: 25,  opacity: 1, duration: 0.5, ease: 'back.out(1.6)' }, '-=0.15')
          .to('.c-ice-2',   { x: 0, y: 0, rotate: -18, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' }, '-=0.38')
          .to('.c-ice-1',   { x: 0, y: 0, rotate: 12,  opacity: 1, duration: 0.5, ease: 'back.out(1.6)' }, '-=0.38')

          /* straw slides in */
          .to('.c-straw',   { x: 0, y: 0, rotate: -7, opacity: 1, duration: 0.35, ease: 'power2.out' }, '-=0.22')

          /* garnish drops with elastic bounce */
          .to('.c-garnish', { y: 0, scale: 1, rotate: 0, opacity: 1, duration: 0.55, ease: 'elastic.out(1, 0.55)' }, '-=0.2')

          /* smoke wisps rise */
          .to('.c-smoke-2', { opacity: 0.85, y: 0, scale: 1, duration: 0.4 }, '-=0.25')
          .to('.c-smoke-1', { opacity: 0.7,  y: 0, scale: 1, duration: 0.4 }, '-=0.3')

          /* text sweeps in from left */
          .to('.h-eyebrow', { opacity: 1, y: 0, duration: 0.35 }, '-=0.4')
          .to('.h-title-1', { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out' }, '-=0.25')
          .to('.h-title-2', { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out' }, '-=0.35')
          .to('.h-desc',    { opacity: 1, y: 0, duration: 0.35 }, '-=0.22')
          .to('.h-ctas',    { opacity: 1, y: 0, duration: 0.35 }, '-=0.25')
      }, sectionRef)
    }

    init()
    return () => { ctx?.revert() }
  }, [])

  return (
    <section ref={sectionRef} className="relative h-screen bg-[#080808] overflow-hidden">

      {/* ── ambient background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 70% at 65% 55%, rgba(30,8,4,0.7), transparent)',
        }} />
        {/* ember particles */}
        {[
          { bottom: '40%', left: '58%', animationDelay: '0s',   animationDuration: '3.2s' },
          { bottom: '42%', left: '62%', animationDelay: '0.8s', animationDuration: '2.8s' },
          { bottom: '38%', left: '55%', animationDelay: '1.5s', animationDuration: '3.5s' },
          { bottom: '44%', left: '65%', animationDelay: '0.4s', animationDuration: '4s'   },
          { bottom: '36%', left: '60%', animationDelay: '2s',   animationDuration: '3s'   },
        ].map((s, i) => (
          <Ember key={i} style={{ animation: `emberFloat ${s.animationDuration} ease-out ${s.animationDelay} infinite`, ...s }} />
        ))}
      </div>

      <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── Left — text ── */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center pr-8">
          <span className="h-eyebrow font-display text-[10px] tracking-[0.5em] text-[#e84800] uppercase block mb-6">
            Underground Bar &amp; Lounge
          </span>

          <h1 className="font-display font-bold leading-none mb-8" style={{ fontSize: 'clamp(3.2rem, 6.5vw, 6.5rem)' }}>
            <span className="h-title-1 block text-[#f5ede8]">ENTER</span>
            <span className="h-title-2 block text-[#e84800] glow-text">THE CAVE</span>
          </h1>

          <p className="h-desc font-sans text-[#7a6055] text-lg leading-relaxed max-w-sm mb-10">
            Where the night has no ceiling. Signature cocktails, underground beats
            and an atmosphere built for those who refuse the ordinary.
          </p>

          <div className="h-ctas flex flex-wrap gap-4">
            <a href="#reservation"
              className="bg-[#e84800] hover:bg-[#ff5500] text-white font-display text-xs tracking-[0.22em] uppercase px-9 py-4 transition-colors duration-300"
              style={{ boxShadow: '0 8px 30px rgba(232,72,0,0.35)', animation: 'pulseGlow 3s ease-in-out infinite' }}>
              Reserve Now
            </a>
            <a href="#menu"
              className="border border-[rgba(232,72,0,0.4)] text-[#f5ede8] font-display text-xs tracking-[0.22em] uppercase px-9 py-4 hover:border-[#e84800] hover:text-[#ff6a00] transition-all duration-300">
              View Menu
            </a>
          </div>
        </div>

        {/* ── Right — 3D cocktail ── */}
        <div className="hidden lg:flex w-1/2 items-center justify-center">
          <Cocktail />
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 pointer-events-none">
        <span className="font-display text-[8px] tracking-[0.5em] text-[#e84800]/35 uppercase">
          Scroll to reveal
        </span>
        <div style={{
          width: 1.5, height: 44,
          background: 'linear-gradient(180deg, rgba(232,72,0,0.7), transparent)',
          animation: 'scrollPulse 1.6s ease-in-out infinite',
        }} />
      </div>
    </section>
  )
}
