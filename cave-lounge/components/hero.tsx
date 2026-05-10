'use client'
import { useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────────────────────
   COCKTAIL — full SVG martini glass with 3D layering
───────────────────────────────────────────────────────────── */
function Cocktail() {
  return (
    <div className="relative" style={{ width: 360, height: 560 }}>

      {/* ── Ground glow ── */}
      <div className="mg-glow absolute pointer-events-none" style={{
        width: 300, height: 100,
        bottom: 30, left: '50%', transform: 'translateX(-50%)',
        background: 'radial-gradient(ellipse, rgba(180,15,45,0.55) 0%, rgba(232,72,0,0.15) 50%, transparent 75%)',
        filter: 'blur(30px)',
      }} />

      {/* ── Reflection on surface ── */}
      <div className="mg-glow absolute pointer-events-none" style={{
        width: 160, height: 30,
        bottom: 58, left: '50%', transform: 'translateX(-50%)',
        background: 'radial-gradient(ellipse, rgba(200,30,60,0.25), transparent 80%)',
        filter: 'blur(8px)',
      }} />

      {/* ── Smoke B (back) ── */}
      <div className="mg-smoke-b absolute pointer-events-none" style={{
        width: 44, height: 80, top: 76, left: '60%',
        background: 'radial-gradient(ellipse at bottom, rgba(220,40,70,0.2), transparent 72%)',
        borderRadius: '50%', filter: 'blur(10px)',
        animation: 'smokeRise 4s ease-in-out 0.5s infinite',
      }} />
      {/* ── Smoke A (front) ── */}
      <div className="mg-smoke-a absolute pointer-events-none" style={{
        width: 34, height: 65, top: 85, left: '42%',
        background: 'radial-gradient(ellipse at bottom, rgba(200,30,55,0.15), transparent 72%)',
        borderRadius: '50%', filter: 'blur(8px)',
        animation: 'smokeRise 3.5s ease-in-out infinite',
      }} />

      {/* ── SHAKER ── */}
      <div className="mg-shaker absolute" style={{
        width: 46, height: 116,
        top: -20, left: '61%',
        transformOrigin: 'bottom center',
        filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.6))',
      }}>
        {/* Body */}
        <div style={{
          width: 46, height: 88, borderRadius: '10px 10px 5px 5px', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(110deg, rgba(200,205,220,0.18) 0%, rgba(160,165,180,0.1) 35%, rgba(240,245,255,0.2) 55%, rgba(170,175,190,0.11) 80%, rgba(200,205,220,0.17) 100%)',
          border: '1px solid rgba(255,255,255,0.28)',
          boxShadow: 'inset 4px 0 14px rgba(255,255,255,0.12), inset -3px 0 8px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.5)',
        }}>
          {/* Vertical sheen */}
          <div style={{ position:'absolute', top:0, left:'30%', width:'18%', height:'100%',
            background:'linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06) 50%, transparent)',
            borderRadius:'50%' }} />
          {/* Horizontal band */}
          <div style={{ position:'absolute', bottom:18, left:6, right:6, height:1,
            background:'rgba(255,255,255,0.12)' }} />
        </div>
        {/* Strainer cap */}
        <div style={{
          width: 36, height: 24, margin:'0 auto', borderRadius:'5px 5px 0 0', position:'relative',
          background: 'linear-gradient(110deg, rgba(190,195,210,0.22), rgba(150,155,170,0.14))',
          border: '1px solid rgba(255,255,255,0.25)',
          boxShadow: 'inset 2px 0 8px rgba(255,255,255,0.1)',
        }}>
          {/* Perforations */}
          {[0,1,2,3,4,5,6,7].map(i => (
            <div key={i} style={{
              position:'absolute', width:3, height:3, borderRadius:'50%',
              background:'rgba(0,0,0,0.5)',
              top: 4 + (i > 3 ? 9 : 0),
              left: 4 + (i % 4) * 7,
            }} />
          ))}
        </div>
      </div>

      {/* ── Pour stream ── */}
      <svg className="mg-pour" style={{
        position:'absolute', top:82, left:'50%', transform:'translateX(18px)',
        overflow:'visible', pointerEvents:'none',
      }} width="80" height="120" viewBox="0 0 80 120">
        <defs>
          <linearGradient id="sg1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(210,30,65,0.95)"/>
            <stop offset="100%" stopColor="rgba(170,15,40,0.6)"/>
          </linearGradient>
        </defs>
        {/* Core stream */}
        <path d="M 50,0 Q 44,50 32,95 Q 28,110 24,120"
          stroke="url(#sg1)" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
        {/* Outer glow */}
        <path d="M 50,0 Q 44,50 32,95 Q 28,110 24,120"
          stroke="rgba(220,60,90,0.25)" strokeWidth="11" fill="none" strokeLinecap="round"
          style={{ filter:'blur(3px)' }}/>
        {/* Twist highlight */}
        <path d="M 48,0 Q 42,50 30,95"
          stroke="rgba(255,180,200,0.2)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>

      {/* ── MARTINI GLASS (SVG) ── */}
      <svg className="mg-glass"
        style={{ position:'absolute', top:68, left:'50%', transform:'translateX(-50%)' }}
        width="260" height="400" viewBox="0 0 260 400">
        <defs>
          {/* Liquid radial glow */}
          <radialGradient id="liqRad" cx="50%" cy="28%" r="62%">
            <stop offset="0%"   stopColor="rgba(230,65,90,0.92)"/>
            <stop offset="42%"  stopColor="rgba(185,18,48,0.97)"/>
            <stop offset="100%" stopColor="rgba(90,4,18,1)"/>
          </radialGradient>
          {/* Glass left-wall gradient */}
          <linearGradient id="wallL" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.14)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
          </linearGradient>
          {/* Glass right-wall gradient */}
          <linearGradient id="wallR" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(255,255,255,0)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0.07)"/>
          </linearGradient>
          {/* Rim gradient */}
          <linearGradient id="rimG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.15)"/>
            <stop offset="30%"  stopColor="rgba(255,255,255,0.6)"/>
            <stop offset="60%"  stopColor="rgba(255,255,255,0.2)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0.1)"/>
          </linearGradient>
          {/* Inner bowl clip */}
          <clipPath id="innerBowlClip">
            <path d="M 17,17 L 243,17 L 133,228 L 127,228 Z"/>
          </clipPath>
          {/* Liquid glow filter */}
          <filter id="liqF" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Shimmer filter */}
          <filter id="shimF">
            <feGaussianBlur stdDeviation="1.5"/>
          </filter>
        </defs>

        {/* ─ 1. Glass back ambient fill ─ */}
        <path d="M 17,17 L 243,17 L 133,228 L 127,228 Z"
          fill="rgba(255,255,255,0.012)"/>

        {/* ─ 2. Liquid (clipped inside bowl) ─ */}
        <path className="mg-liquid"
          d="M 44,82 L 216,82 L 133,228 L 127,228 Z"
          fill="url(#liqRad)" filter="url(#liqF)"
          clipPath="url(#innerBowlClip)"/>

        {/* ─ 3. Liquid inner-light hotspot ─ */}
        <ellipse cx="130" cy="115" rx="48" ry="36"
          fill="rgba(255,120,140,0.07)"
          clipPath="url(#innerBowlClip)"/>

        {/* ─ 4. Liquid shimmer sweep ─ */}
        <rect className="mg-shimmer" x="44" y="82" width="172" height="146"
          clipPath="url(#innerBowlClip)"
          fill="url(#shimSweep)" style={{ mixBlendMode:'overlay' }}/>

        {/* ─ 5. Liquid surface (meniscus) ─ */}
        <path className="mg-liquid-surface"
          d="M 44,82 Q 87,77 130,78 Q 173,77 216,82"
          fill="none" stroke="rgba(240,100,130,0.65)" strokeWidth="1.5"/>
        <ellipse cx="130" cy="82" rx="86" ry="7"
          fill="rgba(230,80,110,0.3)" filter="url(#shimF)"/>

        {/* ─ 6. Tiny bubbles in liquid ─ */}
        {[
          [90, 140],[115,105],[150,160],[170,125],[105,175],[160,100],
        ].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="1.8"
            fill="rgba(255,200,210,0.35)"
            clipPath="url(#innerBowlClip)"/>
        ))}

        {/* ─ 7. Glass walls (thickness) ─ */}
        {/* Left wall */}
        <path d="M 11,14 L 17,17 L 127,228 L 127,231 Z"
          fill="url(#wallL)"/>
        {/* Right wall */}
        <path d="M 249,14 L 243,17 L 133,228 L 133,231 Z"
          fill="url(#wallR)"/>

        {/* ─ 8. Glass bowl outer outline ─ */}
        <path d="M 11,14 L 249,14 L 133,231 L 127,231 Z"
          fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1"/>

        {/* ─ 9. Glass bowl inner outline (refraction line) ─ */}
        <path d="M 17,17 L 243,17 L 133,228 L 127,228 Z"
          fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="0.5"/>

        {/* ─ 10. Surface reflection streaks ─ */}
        <path d="M 35,30 Q 65,45 55,75"
          stroke="rgba(255,255,255,0.07)" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <path d="M 38,28 Q 66,43 56,73"
          stroke="rgba(255,255,255,0.18)" strokeWidth="2" fill="none" strokeLinecap="round"/>

        <path d="M 200,30 Q 185,48 192,68"
          stroke="rgba(255,255,255,0.05)" strokeWidth="7" fill="none" strokeLinecap="round"/>

        {/* ─ 11. RIM ─ */}
        <ellipse className="mg-rim"
          cx="130" cy="14" rx="119" ry="13"
          fill="rgba(255,255,255,0.05)"
          stroke="rgba(255,255,255,0.22)" strokeWidth="0.8"/>
        {/* Rim highlight arc */}
        <path d="M 60,10 Q 130,2 200,10"
          fill="none" stroke="url(#rimG)" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Rim sparkle */}
        <circle cx="82"  cy="8"  r="1.5" fill="rgba(255,255,255,0.8)"/>
        <circle cx="180" cy="8"  r="1"   fill="rgba(255,255,255,0.5)"/>
        <circle cx="130" cy="4"  r="1"   fill="rgba(255,255,255,0.4)"/>

        {/* ─ 12. STEM ─ */}
        <line className="mg-stem"
          x1="130" y1="231" x2="130" y2="358"
          stroke="rgba(255,255,255,0.22)" strokeWidth="1.4" strokeLinecap="round"/>
        {/* Stem highlight */}
        <line x1="131.5" y1="231" x2="131.5" y2="358"
          stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeLinecap="round"/>

        {/* ─ 13. BASE ─ */}
        <ellipse className="mg-base"
          cx="130" cy="365" rx="64" ry="9"
          fill="rgba(255,255,255,0.07)"
          stroke="rgba(255,255,255,0.25)" strokeWidth="0.8"/>
        {/* Base depth line */}
        <path d="M 75,365 Q 130,369 185,365"
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        {/* Base shadow */}
        <ellipse cx="130" cy="373" rx="52" ry="5"
          fill="rgba(0,0,0,0.45)" style={{ filter:'blur(4px)' }}/>
      </svg>

      {/* ── GARNISH: cocktail pick + cranberries + orange peel ── */}
      <div className="mg-garnish absolute" style={{
        top: 110, left: '57%',
        filter: 'drop-shadow(0 2px 8px rgba(180,30,0,0.5))',
      }}>
        {/* Pick stick */}
        <div style={{
          width: 1.5, height: 64, borderRadius: 2,
          background: 'linear-gradient(180deg, rgba(255,220,120,0.95), rgba(180,130,40,0.7))',
          boxShadow: '0 0 4px rgba(255,200,80,0.4)',
          position: 'absolute', top: 0, left: 16,
          transform: 'rotate(8deg)', transformOrigin: 'bottom',
        }} />
        {/* Pearl top */}
        <div style={{
          width: 7, height: 7, borderRadius:'50%',
          background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9), rgba(220,220,240,0.6))',
          position: 'absolute', top: -4, left: 13,
          boxShadow: '0 0 4px rgba(255,255,255,0.5)',
        }} />
        {/* Cranberry 1 */}
        <div style={{
          width: 11, height: 11, borderRadius:'50%',
          background: 'radial-gradient(circle at 32% 28%, #e83868, #8b0022)',
          boxShadow: '0 0 6px rgba(200,20,55,0.7), inset 0 0 4px rgba(255,100,130,0.3)',
          position: 'absolute', top: 8, left: 11,
        }} />
        {/* Cranberry 2 */}
        <div style={{
          width: 10, height: 10, borderRadius:'50%',
          background: 'radial-gradient(circle at 32% 28%, #d02858, #720018)',
          boxShadow: '0 0 5px rgba(180,10,45,0.6)',
          position: 'absolute', top: 22, left: 12,
        }} />
        {/* Cranberry 3 (small) */}
        <div style={{
          width: 8, height: 8, borderRadius:'50%',
          background: 'radial-gradient(circle at 32% 28%, #c02048, #600012)',
          position: 'absolute', top: 34, left: 13,
        }} />
        {/* Orange peel curl */}
        <div style={{
          width: 26, height: 9,
          borderRadius: '0 50% 50% 0 / 0 60% 60% 0',
          background: 'linear-gradient(110deg, #ffa500, #e86000)',
          border: '0.5px solid rgba(255,200,50,0.45)',
          boxShadow: '0 0 10px rgba(255,140,0,0.55), inset 0 1px 3px rgba(255,220,100,0.3)',
          position: 'absolute', top: 44, left: 3,
          transform: 'rotate(-22deg)',
        }} />
      </div>

      {/* ── Micro condensation drops on glass ── */}
      {[
        { top: 130, left: '33%' }, { top: 155, left: '30%' },
        { top: 175, left: '34%' }, { top: 200, left: '31%' },
        { top: 145, left: '68%' }, { top: 170, left: '66%' },
      ].map((d, i) => (
        <div key={i} className="mg-drops" style={{
          position: 'absolute', width: 2.5, height: 3.5, borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
          background: 'rgba(255,255,255,0.18)',
          top: d.top, left: d.left,
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
      const { gsap } = await import('gsap')
      if (!sectionRef.current) return

      ctx = gsap.context(() => {
        /* ── hidden initial states ── */
        gsap.set('.mg-glow',           { opacity: 0, scale: 0.2 })
        gsap.set('.mg-base',           { opacity: 0, scaleX: 0,   transformOrigin: 'center' })
        gsap.set('.mg-stem',           { opacity: 0, scaleY: 0,   transformOrigin: 'bottom' })
        gsap.set(['.mg-glass'],        { opacity: 0 })
        gsap.set('.mg-liquid',         { opacity: 0, scaleY: 0,   transformOrigin: 'bottom' })
        gsap.set('.mg-liquid-surface', { opacity: 0 })
        gsap.set('.mg-rim',            { opacity: 0, scaleX: 0,   transformOrigin: 'center' })
        gsap.set('.mg-shaker',         { opacity: 0, y: -70, rotate: 0 })
        gsap.set('.mg-pour',           { opacity: 0, scaleY: 0,   transformOrigin: 'top' })
        gsap.set('.mg-garnish',        { opacity: 0, y: -50, x: -8, rotate: -25, scale: 0.8 })
        gsap.set('.mg-smoke-a',        { opacity: 0, y: 20 })
        gsap.set('.mg-smoke-b',        { opacity: 0, y: 15 })
        gsap.set('.mg-drops',          { opacity: 0, scale: 0 })
        gsap.set('.h-line-1',          { opacity: 0, y: 35 })
        gsap.set('.h-line-2',          { opacity: 0, y: 35 })
        gsap.set('.h-line-3',          { opacity: 0, y: 28 })
        gsap.set('.h-desc',            { opacity: 0, y: 20 })
        gsap.set('.h-ctas',            { opacity: 0, y: 18 })

        /* ── 2.5 s auto-play timeline ── */
        const tl = gsap.timeline({ delay: 0.25 })

        tl
          /* — 0.00 Glass materialises — */
          .to('.mg-glass',  { opacity: 1, duration: 0.01 })
          .to('.mg-base',   { opacity: 1, scaleX: 1, duration: 0.22, ease: 'power2.out' }, 0)
          .to('.mg-stem',   { opacity: 1, scaleY: 1, duration: 0.3,  ease: 'power3.out' }, 0.12)
          /* bowl fades in slightly after stem */
          .to('.mg-rim',    { opacity: 1, scaleX: 1, duration: 0.28, ease: 'back.out(1.8)' }, 0.28)

          /* — 0.38 Shaker swoops in — */
          .to('.mg-shaker', { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }, 0.38)
          .to('.mg-shaker', { rotate: -44, x: -14, duration: 0.3, ease: 'power2.inOut' }, 0.6)

          /* — 0.82 Pour begins — */
          .to('.mg-pour',   { opacity: 1, scaleY: 1, duration: 0.22 }, 0.82)

          /* — 0.9 Liquid rises — */
          .to('.mg-liquid',         { opacity: 1, scaleY: 1, duration: 0.4, ease: 'power2.out' }, 0.9)
          .to('.mg-liquid-surface', { opacity: 1, duration: 0.18 }, 1.18)

          /* — 1.2 Shaker exits — */
          .to(['.mg-shaker','.mg-pour'], { opacity: 0, y: -20, duration: 0.22, ease: 'power2.in' }, 1.2)

          /* — 1.28 Garnish drops in — */
          .to('.mg-garnish', {
            opacity: 1, y: 0, x: 0, rotate: 0, scale: 1,
            duration: 0.5, ease: 'elastic.out(1.1, 0.55)',
          }, 1.28)

          /* — 1.35 Condensation micro-drops — */
          .to('.mg-drops', {
            opacity: 1, scale: 1,
            duration: 0.3, stagger: 0.04, ease: 'back.out(2)',
          }, 1.35)

          /* — 1.5 Atmosphere — */
          .to('.mg-glow',    { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }, 1.5)
          .to('.mg-smoke-a', { opacity: 0.85, y: 0, duration: 0.4 }, 1.55)
          .to('.mg-smoke-b', { opacity: 0.65, y: 0, duration: 0.4 }, 1.62)

          /* — 1.65 Text reveals (staggered) — */
          .to('.h-line-1', { opacity: 1, y: 0, duration: 0.38, ease: 'power3.out' }, 1.65)
          .to('.h-line-2', { opacity: 1, y: 0, duration: 0.38, ease: 'power3.out' }, 1.78)
          .to('.h-line-3', { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }, 1.9)
          .to('.h-desc',   { opacity: 1, y: 0, duration: 0.32 }, 2.05)
          .to('.h-ctas',   { opacity: 1, y: 0, duration: 0.32 }, 2.18)

      }, sectionRef)
    }

    init()
    return () => { ctx?.revert() }
  }, [])

  return (
    <section ref={sectionRef} className="relative h-screen bg-[#050505] overflow-hidden">

      {/* Ambient background radial */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 50% 60% at 66% 54%, rgba(50,6,14,0.7), transparent)',
      }} />

      <div className="relative z-10 h-full max-w-7xl mx-auto px-8 lg:px-16 flex items-center gap-4">

        {/* ── Left: Text ── */}
        <div className="w-full lg:w-[46%] flex flex-col">
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

          <div className="w-10 h-px my-8 h-line-3" style={{ background: 'rgba(232,72,0,0.35)' }} />

          <p className="h-desc font-sans font-light text-white/25 leading-loose max-w-[300px] mb-12"
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

        {/* ── Right: Cocktail ── */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <Cocktail />
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none z-20">
        <span className="font-display text-[8px] tracking-[0.55em] text-white/12 uppercase">scroll</span>
        <div style={{
          width: 1, height: 44,
          background: 'linear-gradient(180deg, rgba(232,72,0,0.5), transparent)',
          animation: 'scrollLine 2s ease-in-out infinite',
        }} />
      </div>
    </section>
  )
}
