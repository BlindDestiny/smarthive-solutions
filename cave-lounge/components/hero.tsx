'use client'
import { useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────────────────────
   MARTINI GLASS SVG — built from atomic parts for GSAP control
───────────────────────────────────────────────────────────── */
function MartiniGlass() {
  return (
    <div className="relative" style={{ width: 320, height: 520 }}>

      {/* ── Ground glow ── */}
      <div className="mg-glow absolute pointer-events-none" style={{
        width: 260, height: 80,
        bottom: 24, left: '50%', transform: 'translateX(-50%)',
        background: 'radial-gradient(ellipse, rgba(232,72,0,0.4) 0%, transparent 70%)',
        filter: 'blur(28px)',
      }} />

      {/* ── Smoke wisps ── */}
      <div className="mg-smoke-a absolute pointer-events-none" style={{
        width: 50, height: 80, top: 60, left: '48%',
        background: 'radial-gradient(ellipse at bottom, rgba(255,80,20,0.18), transparent 80%)',
        borderRadius: '50%', filter: 'blur(10px)',
        animation: 'smokeRise 3.5s ease-in-out infinite',
      }} />
      <div className="mg-smoke-b absolute pointer-events-none" style={{
        width: 38, height: 65, top: 70, left: '58%',
        background: 'radial-gradient(ellipse at bottom, rgba(255,60,10,0.13), transparent 80%)',
        borderRadius: '50%', filter: 'blur(8px)',
        animation: 'smokeRise 4.2s ease-in-out 0.6s infinite',
      }} />

      {/* ── SHAKER (appears, tilts, pours, disappears) ── */}
      <div className="mg-shaker absolute" style={{
        width: 44, height: 110,
        top: -30, left: '63%',
        transformOrigin: 'bottom center',
      }}>
        {/* Shaker body */}
        <div style={{
          width: 44, height: 85,
          borderRadius: '8px 8px 4px 4px',
          background: 'linear-gradient(135deg, rgba(220,220,240,0.25) 0%, rgba(180,180,200,0.15) 40%, rgba(240,240,255,0.22) 100%)',
          border: '1px solid rgba(255,255,255,0.35)',
          boxShadow: 'inset 3px 0 10px rgba(255,255,255,0.15), inset -2px 0 6px rgba(0,0,0,0.2), 0 10px 30px rgba(0,0,0,0.5)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position:'absolute', top:0, left:'25%', right:'25%', height:'100%',
            background:'linear-gradient(180deg, rgba(255,255,255,0.12), transparent)',
            borderRadius:'50%' }} />
        </div>
        {/* Strainer cap */}
        <div style={{
          width: 36, height: 22,
          margin: '0 auto',
          borderRadius: '4px 4px 0 0',
          background: 'linear-gradient(135deg, rgba(200,200,220,0.22), rgba(160,160,180,0.16))',
          border: '1px solid rgba(255,255,255,0.3)',
          position: 'relative',
        }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: 3, height: 3, borderRadius: '50%',
              background: 'rgba(0,0,0,0.4)',
              top: 5 + (i > 2 ? 7 : 0),
              left: 5 + (i % 3) * 8,
            }} />
          ))}
        </div>
      </div>

      {/* ── Pour stream (SVG path) ── */}
      <svg className="mg-pour" style={{
        position: 'absolute', top: 68, left: '50%',
        transform: 'translateX(-10px)',
        overflow: 'visible', pointerEvents: 'none',
      }} width="60" height="100" viewBox="0 0 60 100">
        <defs>
          <linearGradient id="streamGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(220,30,60,0.9)" />
            <stop offset="100%" stopColor="rgba(180,10,30,0.5)" />
          </linearGradient>
        </defs>
        <path d="M 40,0 Q 35,40 28,80 Q 25,92 22,100"
          stroke="url(#streamGrad)" strokeWidth="4" fill="none"
          strokeLinecap="round"
          style={{ filter: 'blur(1px)' }} />
        <path d="M 43,0 Q 38,40 31,80 Q 28,92 25,100"
          stroke="rgba(255,80,80,0.3)" strokeWidth="7" fill="none"
          strokeLinecap="round"
          style={{ filter: 'blur(3px)' }} />
      </svg>

      {/* ── MARTINI GLASS SVG ── */}
      <svg className="mg-glass"
        style={{ position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)' }}
        width="260" height="390" viewBox="0 0 260 390">
        <defs>
          <linearGradient id="liqGrad" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%"   stopColor="rgba(200,20,55,0.88)" />
            <stop offset="45%"  stopColor="rgba(155,10,35,0.95)" />
            <stop offset="100%" stopColor="rgba(80,3,15,1)" />
          </linearGradient>
          <linearGradient id="glassLeft" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.12)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <linearGradient id="glassRight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.07)" />
          </linearGradient>
          <filter id="liqGlow">
            <feGaussianBlur stdDeviation="4" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <clipPath id="bowlClip">
            <path d="M 16,18 L 244,18 L 133,222 L 127,222 Z" />
          </clipPath>
        </defs>

        {/* Bowl glass back tint */}
        <path className="mg-bowl-back"
          d="M 16,18 L 244,18 L 133,222 L 127,222 Z"
          fill="rgba(255,255,255,0.018)" />

        {/* Liquid fill */}
        <path className="mg-liquid"
          d="M 45,75 L 215,75 L 133,222 L 127,222 Z"
          fill="url(#liqGrad)"
          filter="url(#liqGlow)" />

        {/* Liquid shimmer sweep */}
        <rect className="mg-shimmer"
          x="45" y="75" width="170" height="147"
          clipPath="url(#bowlClip)"
          fill="rgba(255,255,255,0)"
          style={{ overflow: 'hidden' }}>
        </rect>
        <path
          d="M 55,90 L 90,90 L 150,215 L 115,215 Z"
          fill="rgba(255,180,180,0.07)"
          clipPath="url(#bowlClip)" />

        {/* Liquid surface */}
        <ellipse className="mg-liquid-surface"
          cx="130" cy="75" rx="85" ry="9"
          fill="rgba(220,60,80,0.5)" />

        {/* Left glass edge highlight */}
        <path d="M 16,18 L 52,18 L 140,222 L 127,222 Z"
          fill="url(#glassLeft)" />

        {/* Right glass edge */}
        <path d="M 210,18 L 244,18 L 133,222 L 120,222 Z"
          fill="url(#glassRight)" />

        {/* Bowl outline */}
        <path className="mg-bowl-outline"
          d="M 16,18 L 244,18 L 133,222 L 127,222 Z"
          fill="none"
          stroke="rgba(255,255,255,0.22)" strokeWidth="1" />

        {/* Rim ellipse */}
        <ellipse className="mg-rim"
          cx="130" cy="18" rx="114" ry="12"
          fill="rgba(255,255,255,0.055)"
          stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />

        {/* Stem */}
        <line className="mg-stem"
          x1="130" y1="222" x2="130" y2="348"
          stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"
          strokeLinecap="round" />

        {/* Base ellipse */}
        <ellipse className="mg-base"
          cx="130" cy="355" rx="62" ry="8"
          fill="rgba(255,255,255,0.08)"
          stroke="rgba(255,255,255,0.28)" strokeWidth="0.8" />

        {/* Base shadow */}
        <ellipse cx="130" cy="362" rx="50" ry="5"
          fill="rgba(0,0,0,0.4)" />
      </svg>

      {/* ── Garnish: cocktail pick on rim ── */}
      <div className="mg-garnish absolute pointer-events-none"
        style={{ top: 100, left: '56%' }}>
        {/* The stick */}
        <div style={{
          width: 1.5, height: 58, borderRadius: 2,
          background: 'linear-gradient(180deg, rgba(255,200,100,0.9), rgba(200,140,60,0.7))',
          boxShadow: '0 0 6px rgba(255,180,80,0.5)',
          position: 'absolute', top: 0, left: 14,
          transformOrigin: 'bottom',
          transform: 'rotate(5deg)',
        }} />
        {/* Cranberry 1 */}
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #e83060, #8b0020)',
          boxShadow: '0 0 6px rgba(200,20,50,0.7)',
          position: 'absolute', top: 6, left: 10,
        }} />
        {/* Cranberry 2 */}
        <div style={{
          width: 9, height: 9, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #d02050, #700015)',
          position: 'absolute', top: 18, left: 12,
          boxShadow: '0 0 5px rgba(180,10,40,0.6)',
        }} />
        {/* Orange peel curl */}
        <div style={{
          width: 22, height: 10,
          borderRadius: '0 50% 50% 0',
          background: 'linear-gradient(135deg, #ff9900, #e86000)',
          border: '0.5px solid rgba(255,200,50,0.5)',
          boxShadow: '0 0 8px rgba(255,140,0,0.6)',
          position: 'absolute', top: 30, left: 4,
          transform: 'rotate(-20deg)',
        }} />
      </div>

      {/* ── Ember particles ── */}
      {[
        { bottom: 155, left: '52%', delay: '0s',   dur: '2.8s' },
        { bottom: 160, left: '56%', delay: '0.9s', dur: '3.2s' },
        { bottom: 152, left: '48%', delay: '1.6s', dur: '2.5s' },
      ].map((e, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 2.5, height: 2.5, borderRadius: '50%',
          background: 'rgba(232,72,0,0.8)',
          bottom: e.bottom, left: e.left,
          animation: `emberDrift ${e.dur} ease-out ${e.delay} infinite`,
          pointerEvents: 'none',
        }} />
      ))}
    </div>
  )
}

/* ─── Hero ───────────────────────────────────────────────── */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let ctx: { revert: () => void } | null = null

    const init = async () => {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      if (!sectionRef.current) return

      ctx = gsap.context(() => {
        /* ── Initial hidden state ── */
        gsap.set('.mg-glow',          { opacity: 0, scale: 0.3 })
        gsap.set('.mg-base',          { opacity: 0, scaleX: 0, transformOrigin: 'center' })
        gsap.set('.mg-stem',          { opacity: 0, scaleY: 0, transformOrigin: 'bottom' })
        gsap.set('.mg-bowl-back',     { opacity: 0, scaleY: 0, transformOrigin: 'bottom center' })
        gsap.set('.mg-bowl-outline',  { opacity: 0, scaleY: 0, transformOrigin: 'bottom center' })
        gsap.set('.mg-rim',           { opacity: 0, scaleX: 0, transformOrigin: 'center' })
        gsap.set('.mg-liquid',        { opacity: 0, scaleY: 0, transformOrigin: 'bottom' })
        gsap.set('.mg-liquid-surface',{ opacity: 0 })
        gsap.set('.mg-shaker',        { opacity: 0, y: -60, rotate: 0 })
        gsap.set('.mg-pour',          { opacity: 0, scaleY: 0, transformOrigin: 'top' })
        gsap.set('.mg-garnish',       { opacity: 0, y: -40, x: -10, rotate: -30 })
        gsap.set('.mg-smoke-a',       { opacity: 0 })
        gsap.set('.mg-smoke-b',       { opacity: 0 })
        gsap.set('.h-line-1',         { opacity: 0, y: 40 })
        gsap.set('.h-line-2',         { opacity: 0, y: 40 })
        gsap.set('.h-line-3',         { opacity: 0, y: 30 })
        gsap.set('.h-desc',           { opacity: 0, y: 25 })
        gsap.set('.h-ctas',           { opacity: 0, y: 20 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=240%',
            scrub: 1.6,
            pin: true,
          },
        })

        tl
          /* 1 — Glass materialises from base up */
          .to('.mg-base',         { opacity: 1, scaleX: 1, duration: 0.25, ease: 'power2.out' })
          .to('.mg-stem',         { opacity: 1, scaleY: 1, duration: 0.35, ease: 'power3.out' }, '-=0.05')
          .to('.mg-bowl-back',    { opacity: 1, scaleY: 1, duration: 0.45, ease: 'power3.out' }, '-=0.1')
          .to('.mg-bowl-outline', { opacity: 1, scaleY: 1, duration: 0.45, ease: 'power3.out' }, '-=0.4')
          .to('.mg-rim',          { opacity: 1, scaleX: 1, duration: 0.3,  ease: 'back.out(2)' }, '-=0.1')

          /* 2 — Shaker appears, tilts to pour */
          .to('.mg-shaker', { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, '+=0.05')
          .to('.mg-shaker', { rotate: -42, x: -12, duration: 0.35, ease: 'power2.inOut' }, '-=0.05')

          /* 3 — Pour stream + liquid fills */
          .to('.mg-pour',          { opacity: 1, scaleY: 1, duration: 0.25 }, '-=0.1')
          .to('.mg-liquid',        { opacity: 1, scaleY: 1, duration: 0.45, ease: 'power2.out' }, '-=0.1')
          .to('.mg-liquid-surface',{ opacity: 1, duration: 0.2 }, '-=0.05')

          /* 4 — Shaker & stream disappear */
          .to(['.mg-shaker', '.mg-pour'], { opacity: 0, duration: 0.2 }, '-=0.05')

          /* 5 — Garnish drops in */
          .to('.mg-garnish', { opacity: 1, y: 0, x: 0, rotate: 0, duration: 0.45, ease: 'elastic.out(1, 0.6)' }, '-=0.1')

          /* 6 — Smoke + glow */
          .to('.mg-glow',    { opacity: 1, scale: 1, duration: 0.4 }, '-=0.2')
          .to('.mg-smoke-a', { opacity: 0.9, duration: 0.35 }, '-=0.2')
          .to('.mg-smoke-b', { opacity: 0.7, duration: 0.35 }, '-=0.28')

          /* 7 — Text sweeps in */
          .to('.h-line-1', { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, '-=0.25')
          .to('.h-line-2', { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, '-=0.3')
          .to('.h-line-3', { opacity: 1, y: 0, duration: 0.4,  ease: 'power3.out' }, '-=0.3')
          .to('.h-desc',   { opacity: 1, y: 0, duration: 0.35 }, '-=0.25')
          .to('.h-ctas',   { opacity: 1, y: 0, duration: 0.35 }, '-=0.22')

      }, sectionRef)
    }

    init()
    return () => { ctx?.revert() }
  }, [])

  return (
    <section ref={sectionRef} className="relative h-screen bg-[#050505] overflow-hidden">

      {/* Very subtle radial ambient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 55% 65% at 68% 52%, rgba(40,8,4,0.6), transparent)',
      }} />

      <div className="relative z-10 h-full max-w-7xl mx-auto px-8 lg:px-16 flex items-center gap-8">

        {/* ── Left: Text ── */}
        <div className="w-full lg:w-[48%] flex flex-col">

          <div className="h-line-1 mb-3">
            <span className="font-display text-[9px] tracking-[0.55em] text-[#e84800] uppercase">
              Underground Bar &amp; Lounge
            </span>
          </div>

          <h1 className="font-display font-bold leading-none mb-2"
            style={{ fontSize: 'clamp(3.8rem, 7vw, 7.5rem)' }}>
            <span className="h-line-2 block text-[#ede8e4]">ENTER</span>
            <span className="h-line-3 block text-[#e84800] glow-text">THE CAVE</span>
          </h1>

          <div className="w-14 h-px bg-[#e84800]/40 my-8 h-line-3" />

          <p className="h-desc font-sans font-light text-white/30 leading-loose max-w-xs mb-12"
            style={{ fontSize: '0.95rem', letterSpacing: '0.02em' }}>
            Where extraordinary cocktails meet a world built beneath the streets.
            Bold flavours. Pure atmosphere.
          </p>

          <div className="h-ctas flex flex-wrap gap-4">
            <a href="#reservation"
              className="font-display text-[10px] tracking-[0.25em] uppercase px-9 py-4 bg-[#e84800] text-white hover:bg-[#ff5500] transition-colors duration-300"
              style={{ animation: 'subtlePulse 3s ease-in-out infinite' }}>
              Reserve Now
            </a>
            <a href="#menu"
              className="font-display text-[10px] tracking-[0.25em] uppercase px-9 py-4 glass text-white/50 hover:text-white hover:border-[rgba(232,72,0,0.3)] transition-all duration-400">
              Explore Menu
            </a>
          </div>
        </div>

        {/* ── Right: Cocktail ── */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <MartiniGlass />
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none z-20">
        <span className="font-display text-[8px] tracking-[0.55em] text-white/15 uppercase">scroll</span>
        <div style={{
          width: 1, height: 48,
          background: 'linear-gradient(180deg, rgba(232,72,0,0.6), transparent)',
          animation: 'scrollLine 1.8s ease-in-out infinite',
        }} />
      </div>
    </section>
  )
}
