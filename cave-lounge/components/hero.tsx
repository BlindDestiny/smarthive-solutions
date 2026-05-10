'use client'
import { useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────────────────────
   SHAKER SVG — 3-part stainless steel cocktail shaker
   Reference: dome cap with knurling, ridged strainer collar,
   classic tapered body (wide in mid, narrow at base)
───────────────────────────────────────────────────────────── */
function ShakerSVG() {
  return (
    <svg viewBox="0 0 56 136" width={56} height={136} style={{ overflow: 'visible' }}>
      <defs>
        {/* Steel body: dark–light–bright–light–bright–dark */}
        <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#4a5060"/>
          <stop offset="10%"  stopColor="#909aaa"/>
          <stop offset="24%"  stopColor="#d4dae8"/>
          <stop offset="38%"  stopColor="#edf0f8"/>
          <stop offset="52%"  stopColor="#c8ceda"/>
          <stop offset="66%"  stopColor="#a0a8b8"/>
          <stop offset="79%"  stopColor="#d8dce8"/>
          <stop offset="90%"  stopColor="#aab0c0"/>
          <stop offset="100%" stopColor="#505868"/>
        </linearGradient>
        {/* Cap slightly brighter */}
        <linearGradient id="steelCap" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#404858"/>
          <stop offset="18%"  stopColor="#b8c0d0"/>
          <stop offset="38%"  stopColor="#e8ecf5"/>
          <stop offset="55%"  stopColor="#f0f4ff"/>
          <stop offset="72%"  stopColor="#c0c8d8"/>
          <stop offset="88%"  stopColor="#b0b8c8"/>
          <stop offset="100%" stopColor="#484e5e"/>
        </linearGradient>
        <filter id="stkShadow">
          <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="rgba(0,0,0,0.55)"/>
        </filter>
      </defs>

      {/* ── BODY: classic vase taper ── */}
      {/* outer shape: 9→8px wide at top-collar join, swells to 48px at 65% down, narrows to 38px at base */}
      <path
        d="M 11,52 C 6,64 4,80 4,96 C 4,108 8,118 13,124
           L 43,124 C 48,118 52,108 52,96 C 52,80 50,64 45,52
           Q 28,48 11,52 Z"
        fill="url(#steel)" filter="url(#stkShadow)"/>
      {/* body center highlight strip */}
      <path
        d="M 20,52 C 17,64 16,80 16,96 C 16,105 18,114 20,120
           L 24,120 C 22,114 20,105 20,96 C 20,80 21,64 24,52 Z"
        fill="rgba(255,255,255,0.13)"/>
      {/* body right shadow */}
      <path
        d="M 45,52 C 50,64 52,80 52,96 C 52,108 48,118 43,124
           L 47,124 C 51,119 54,110 54,96 C 54,80 52,64 47,52 Z"
        fill="rgba(0,0,0,0.18)"/>
      {/* base rim */}
      <path d="M 13,124 Q 28,128 43,124"
        fill="none" stroke="rgba(40,45,58,0.6)" strokeWidth="1.2"/>
      <ellipse cx="28" cy="125" rx="16" ry="4"
        fill="url(#steel)" stroke="rgba(35,40,52,0.5)" strokeWidth="0.6"/>

      {/* ── STRAINER COLLAR ── */}
      {/* slightly wider than body top — sits proud */}
      <path
        d="M 7,28 L 7,52 Q 28,55 49,52 L 49,28 Q 28,25 7,28 Z"
        fill="url(#steel)"/>
      {/* 6 horizontal ridge lines */}
      {[0,1,2,3,4,5].map(i => (
        <path key={i}
          d={`M 7,${30+i*3.8} Q 28,${27+i*3.8} 49,${30+i*3.8}`}
          fill="none" stroke="rgba(30,35,50,0.32)" strokeWidth="1"/>
      ))}
      {/* collar top + bottom lip */}
      <path d="M 7,28 Q 28,25 49,28" fill="none" stroke="rgba(55,60,72,0.55)" strokeWidth="1"/>
      <path d="M 7,52 Q 28,55 49,52" fill="none" stroke="rgba(55,60,72,0.55)" strokeWidth="1"/>
      {/* collar highlight band */}
      <path
        d="M 18,28 L 18,52 L 22,51 L 22,28 Z"
        fill="rgba(255,255,255,0.1)"/>

      {/* ── CAP (dome) ── */}
      {/* dome shape: wide at collar join, curves up to small knob */}
      <path
        d="M 9,28 Q 8,12 28,5 Q 48,12 47,28 Z"
        fill="url(#steelCap)"/>
      {/* cap knurling arcs (5 horizontal rings) */}
      {[0,1,2,3,4].map(i => (
        <path key={i}
          d={`M ${9+i},${28-i*1} Q 28,${22-i*3} ${47-i},${28-i}`}
          fill="none" stroke="rgba(30,38,55,0.28)" strokeWidth="0.9"/>
      ))}
      {/* cap outline */}
      <path d="M 9,28 Q 8,12 28,5 Q 48,12 47,28"
        fill="none" stroke="rgba(40,45,58,0.4)" strokeWidth="0.8"/>
      {/* knob / top button */}
      <ellipse cx="28" cy="6" rx="6" ry="4"
        fill="url(#steelCap)" stroke="rgba(40,45,58,0.45)" strokeWidth="0.7"/>
      <ellipse cx="26.5" cy="5" rx="2.5" ry="1.5"
        fill="rgba(255,255,255,0.55)"/>
      {/* cap center highlight */}
      <path d="M 20,28 C 19,18 22,10 28,6 C 34,10 37,18 36,28 L 32,28 C 33,18 31,12 28,8 C 25,12 23,18 24,28 Z"
        fill="rgba(255,255,255,0.08)"/>
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   ICE CUBE SVG — 3D isometric with top/front/right faces,
   crystal-clear blue-white, internal refraction highlights
───────────────────────────────────────────────────────────── */
function IceCubeSVG({ size = 52, rotate = 0 }: { size?: number; rotate?: number }) {
  const id = `ice${size}${rotate}`
  const w = 60, h = 56 // base viewBox

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={size} height={Math.round(size * h / w)}
      style={{ transform: `rotate(${rotate}deg)`, overflow: 'visible' }}>
      <defs>
        <linearGradient id={`${id}t`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%"   stopColor="rgba(235,248,255,0.88)"/>
          <stop offset="100%" stopColor="rgba(200,228,255,0.68)"/>
        </linearGradient>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="rgba(205,230,255,0.72)"/>
          <stop offset="60%"  stopColor="rgba(175,210,252,0.56)"/>
          <stop offset="100%" stopColor="rgba(155,200,248,0.45)"/>
        </linearGradient>
        <linearGradient id={`${id}r`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(180,215,255,0.62)"/>
          <stop offset="100%" stopColor="rgba(135,182,240,0.38)"/>
        </linearGradient>
        <filter id={`${id}glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.8" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── Right face (slightly darkest) ── */}
      <path d="M 50,18 L 50,44 L 30,52 L 30,28 Z"
        fill={`url(#${id}r)`}
        stroke="rgba(195,228,255,0.55)" strokeWidth="0.8"/>

      {/* ── Front-left face ── */}
      <path d="M 10,18 L 10,44 L 30,52 L 30,28 Z"
        fill={`url(#${id}l)`}
        stroke="rgba(215,238,255,0.65)" strokeWidth="0.8"/>

      {/* ── Top face (brightest) ── */}
      <path d="M 10,18 L 30,8 L 50,18 L 30,28 Z"
        fill={`url(#${id}t)`}
        stroke="rgba(245,255,255,0.85)" strokeWidth="0.9"/>

      {/* ── Internal refraction blob ── */}
      <ellipse cx="24" cy="24" rx="9" ry="5"
        fill="rgba(255,255,255,0.22)"
        transform="rotate(-25 24 24)"/>

      {/* ── Top face bright edge highlight ── */}
      <path d="M 27,9 L 30,8 L 33,9"
        stroke="rgba(255,255,255,0.95)" strokeWidth="1.4"
        fill="none" strokeLinecap="round"
        filter={`url(#${id}glow)`}/>

      {/* ── Front face vertical light streak ── */}
      <path d="M 12,21 L 12,38"
        stroke="rgba(255,255,255,0.28)" strokeWidth="2.5"
        fill="none" strokeLinecap="round"
        style={{ filter: 'blur(1.2px)' }}/>

      {/* ── Right face diagonal glint ── */}
      <path d="M 47,20 L 42,28"
        stroke="rgba(255,255,255,0.2)" strokeWidth="2"
        fill="none" strokeLinecap="round"
        style={{ filter: 'blur(0.8px)' }}/>

      {/* ── Melt drop at base-left ── */}
      <ellipse cx="16" cy="52.5" rx="3.5" ry="1.2"
        fill="rgba(190,222,255,0.45)"/>
      <ellipse cx="30" cy="53" rx="2.5" ry="1"
        fill="rgba(190,222,255,0.32)"/>
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   COCKTAIL SCENE
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
      <div className="mg-glow absolute pointer-events-none" style={{
        width: 160, height: 30,
        bottom: 58, left: '50%', transform: 'translateX(-50%)',
        background: 'radial-gradient(ellipse, rgba(200,30,60,0.22), transparent 80%)',
        filter: 'blur(8px)',
      }} />

      {/* ── Smoke ── */}
      <div className="mg-smoke-b absolute pointer-events-none" style={{
        width: 44, height: 80, top: 76, left: '60%',
        background: 'radial-gradient(ellipse at bottom, rgba(220,40,70,0.2), transparent 72%)',
        borderRadius: '50%', filter: 'blur(10px)',
        animation: 'smokeRise 4s ease-in-out 0.5s infinite',
      }} />
      <div className="mg-smoke-a absolute pointer-events-none" style={{
        width: 34, height: 65, top: 85, left: '42%',
        background: 'radial-gradient(ellipse at bottom, rgba(200,30,55,0.15), transparent 72%)',
        borderRadius: '50%', filter: 'blur(8px)',
        animation: 'smokeRise 3.5s ease-in-out infinite',
      }} />

      {/* ── SHAKER (positioned above, tilts to pour) ── */}
      <div className="mg-shaker absolute" style={{
        top: -28, left: '59%',
        transformOrigin: 'bottom center',
        filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.6))',
      }}>
        <ShakerSVG />
      </div>

      {/* ── Pour stream ── */}
      <svg className="mg-pour" style={{
        position:'absolute', top: 85, left: '50%', transform:'translateX(20px)',
        overflow:'visible', pointerEvents:'none',
      }} width="80" height="110" viewBox="0 0 80 110">
        <defs>
          <linearGradient id="pourGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="rgba(210,30,65,0.95)"/>
            <stop offset="100%" stopColor="rgba(170,15,40,0.5)"/>
          </linearGradient>
        </defs>
        <path d="M 48,0 Q 42,48 30,90 Q 26,104 22,110"
          stroke="url(#pourGrad)" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
        <path d="M 48,0 Q 42,48 30,90 Q 26,104 22,110"
          stroke="rgba(225,60,90,0.22)" strokeWidth="12" fill="none" strokeLinecap="round"
          style={{ filter:'blur(3px)' }}/>
        <path d="M 46,0 Q 40,48 28,90"
          stroke="rgba(255,190,210,0.2)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>

      {/* ── MARTINI GLASS (SVG) ── */}
      <svg className="mg-glass"
        style={{ position:'absolute', top:68, left:'50%', transform:'translateX(-50%)' }}
        width="260" height="400" viewBox="0 0 260 400">
        <defs>
          <radialGradient id="liqRad" cx="50%" cy="28%" r="62%">
            <stop offset="0%"   stopColor="rgba(230,65,90,0.92)"/>
            <stop offset="42%"  stopColor="rgba(185,18,48,0.97)"/>
            <stop offset="100%" stopColor="rgba(90,4,18,1)"/>
          </radialGradient>
          <linearGradient id="wallL" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.14)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
          </linearGradient>
          <linearGradient id="wallR" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(255,255,255,0)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0.07)"/>
          </linearGradient>
          <linearGradient id="rimG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.15)"/>
            <stop offset="30%"  stopColor="rgba(255,255,255,0.7)"/>
            <stop offset="60%"  stopColor="rgba(255,255,255,0.25)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0.1)"/>
          </linearGradient>
          <clipPath id="innerBowlClip">
            <path d="M 17,17 L 243,17 L 133,228 L 127,228 Z"/>
          </clipPath>
          <filter id="liqF" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="shimF"><feGaussianBlur stdDeviation="1.5"/></filter>
        </defs>

        <path d="M 17,17 L 243,17 L 133,228 L 127,228 Z"
          fill="rgba(255,255,255,0.012)"/>

        <path className="mg-liquid"
          d="M 44,82 L 216,82 L 133,228 L 127,228 Z"
          fill="url(#liqRad)" filter="url(#liqF)"
          clipPath="url(#innerBowlClip)"/>

        <ellipse cx="130" cy="115" rx="48" ry="36"
          fill="rgba(255,120,140,0.07)"
          clipPath="url(#innerBowlClip)"/>

        <path className="mg-liquid-surface"
          d="M 44,82 Q 87,77 130,78 Q 173,77 216,82"
          fill="none" stroke="rgba(240,100,130,0.65)" strokeWidth="1.5"/>
        <ellipse cx="130" cy="82" rx="86" ry="7"
          fill="rgba(230,80,110,0.3)" filter="url(#shimF)"/>

        <path d="M 11,14 L 17,17 L 127,228 L 127,231 Z" fill="url(#wallL)"/>
        <path d="M 249,14 L 243,17 L 133,228 L 133,231 Z" fill="url(#wallR)"/>

        <path d="M 11,14 L 249,14 L 133,231 L 127,231 Z"
          fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1"/>
        <path d="M 17,17 L 243,17 L 133,228 L 127,228 Z"
          fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="0.5"/>

        <path d="M 35,30 Q 65,45 55,75"
          stroke="rgba(255,255,255,0.07)" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <path d="M 38,28 Q 66,43 56,73"
          stroke="rgba(255,255,255,0.18)" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M 200,30 Q 185,48 192,68"
          stroke="rgba(255,255,255,0.05)" strokeWidth="7" fill="none" strokeLinecap="round"/>

        <ellipse className="mg-rim"
          cx="130" cy="14" rx="119" ry="13"
          fill="rgba(255,255,255,0.05)"
          stroke="rgba(255,255,255,0.22)" strokeWidth="0.8"/>
        <path d="M 60,10 Q 130,2 200,10"
          fill="none" stroke="url(#rimG)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="82"  cy="8"  r="1.5" fill="rgba(255,255,255,0.8)"/>
        <circle cx="180" cy="8"  r="1"   fill="rgba(255,255,255,0.5)"/>
        <circle cx="130" cy="4"  r="1"   fill="rgba(255,255,255,0.4)"/>

        <line className="mg-stem"
          x1="130" y1="231" x2="130" y2="358"
          stroke="rgba(255,255,255,0.22)" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="131.5" y1="231" x2="131.5" y2="358"
          stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeLinecap="round"/>

        <ellipse className="mg-base"
          cx="130" cy="365" rx="64" ry="9"
          fill="rgba(255,255,255,0.07)"
          stroke="rgba(255,255,255,0.25)" strokeWidth="0.8"/>
        <path d="M 75,365 Q 130,369 185,365"
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <ellipse cx="130" cy="373" rx="52" ry="5"
          fill="rgba(0,0,0,0.45)" style={{ filter:'blur(4px)' }}/>
      </svg>

      {/* ── ICE CUBES (appear inside/above liquid) ── */}
      <div className="mg-ice-1 absolute" style={{
        top: 162, left: '22%', zIndex: 6,
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
      }}>
        <IceCubeSVG size={54} rotate={-8} />
      </div>
      <div className="mg-ice-2 absolute" style={{
        top: 148, left: '50%', zIndex: 7,
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.35))',
      }}>
        <IceCubeSVG size={50} rotate={12} />
      </div>
      <div className="mg-ice-3 absolute" style={{
        top: 170, left: '54%', zIndex: 5,
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.45))',
      }}>
        <IceCubeSVG size={46} rotate={-18} />
      </div>

      {/* ── GARNISH ── */}
      <div className="mg-garnish absolute" style={{
        top: 110, left: '57%',
        filter: 'drop-shadow(0 2px 8px rgba(180,30,0,0.5))',
      }}>
        <div style={{
          width: 1.5, height: 64, borderRadius: 2,
          background: 'linear-gradient(180deg, rgba(255,220,120,0.95), rgba(180,130,40,0.7))',
          boxShadow: '0 0 4px rgba(255,200,80,0.4)',
          position: 'absolute', top: 0, left: 16,
          transform: 'rotate(8deg)', transformOrigin: 'bottom',
        }} />
        <div style={{
          width: 7, height: 7, borderRadius:'50%',
          background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9), rgba(220,220,240,0.6))',
          position: 'absolute', top: -4, left: 13,
          boxShadow: '0 0 4px rgba(255,255,255,0.5)',
        }} />
        <div style={{
          width: 11, height: 11, borderRadius:'50%',
          background: 'radial-gradient(circle at 32% 28%, #e83868, #8b0022)',
          boxShadow: '0 0 6px rgba(200,20,55,0.7), inset 0 0 4px rgba(255,100,130,0.3)',
          position: 'absolute', top: 8, left: 11,
        }} />
        <div style={{
          width: 10, height: 10, borderRadius:'50%',
          background: 'radial-gradient(circle at 32% 28%, #d02858, #720018)',
          boxShadow: '0 0 5px rgba(180,10,45,0.6)',
          position: 'absolute', top: 22, left: 12,
        }} />
        <div style={{
          width: 8, height: 8, borderRadius:'50%',
          background: 'radial-gradient(circle at 32% 28%, #c02048, #600012)',
          position: 'absolute', top: 34, left: 13,
        }} />
        <div style={{
          width: 26, height: 9,
          borderRadius: '0 50% 50% 0 / 0 60% 60% 0',
          background: 'linear-gradient(110deg, #ffa500, #e86000)',
          border: '0.5px solid rgba(255,200,50,0.45)',
          boxShadow: '0 0 10px rgba(255,140,0,0.55)',
          position: 'absolute', top: 44, left: 3,
          transform: 'rotate(-22deg)',
        }} />
      </div>

      {/* ── Condensation drops ── */}
      {[
        { top:130,left:'33%'},{top:155,left:'30%'},{top:178,left:'34%'},
        {top:200,left:'31%'},{top:145,left:'68%'},{top:172,left:'66%'},
      ].map((d, i) => (
        <div key={i} className="mg-drops" style={{
          position:'absolute', width: 2.5, height: 3.5,
          borderRadius:'50% 50% 50% 50% / 40% 40% 60% 60%',
          background:'rgba(255,255,255,0.18)',
          top: d.top, left: d.left,
        }} />
      ))}

      {/* ── Ember particles ── */}
      {[
        {bottom:155,left:'52%',delay:'0s',  dur:'2.8s'},
        {bottom:160,left:'56%',delay:'0.9s',dur:'3.2s'},
        {bottom:152,left:'48%',delay:'1.6s',dur:'2.5s'},
      ].map((e,i) => (
        <div key={i} style={{
          position:'absolute', width:2.5, height:2.5, borderRadius:'50%',
          background:'rgba(232,72,0,0.8)',
          bottom:e.bottom, left:e.left,
          animation:`emberDrift ${e.dur} ease-out ${e.delay} infinite`,
          pointerEvents:'none',
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
        gsap.set('.mg-glow',           { opacity:0, scale:0.2 })
        gsap.set('.mg-base',           { opacity:0, scaleX:0,  transformOrigin:'center' })
        gsap.set('.mg-stem',           { opacity:0, scaleY:0,  transformOrigin:'bottom' })
        gsap.set('.mg-glass',          { opacity:0 })
        gsap.set('.mg-liquid',         { opacity:0, scaleY:0,  transformOrigin:'bottom' })
        gsap.set('.mg-liquid-surface', { opacity:0 })
        gsap.set('.mg-rim',            { opacity:0, scaleX:0,  transformOrigin:'center' })
        gsap.set('.mg-shaker',         { opacity:0, y:-70, rotate:0 })
        gsap.set('.mg-pour',           { opacity:0, scaleY:0,  transformOrigin:'top' })
        gsap.set('.mg-ice-1',          { opacity:0, x:-280, y:-160, rotate:120 })
        gsap.set('.mg-ice-2',          { opacity:0, x:260,  y:-140, rotate:-90 })
        gsap.set('.mg-ice-3',          { opacity:0, x:-160, y:220,  rotate:200 })
        gsap.set('.mg-garnish',        { opacity:0, y:-50, x:-8, rotate:-25, scale:0.8 })
        gsap.set('.mg-smoke-a',        { opacity:0, y:20 })
        gsap.set('.mg-smoke-b',        { opacity:0, y:15 })
        gsap.set('.mg-drops',          { opacity:0, scale:0 })
        gsap.set('.h-line-1',          { opacity:0, y:35 })
        gsap.set('.h-line-2',          { opacity:0, y:35 })
        gsap.set('.h-line-3',          { opacity:0, y:28 })
        gsap.set('.h-desc',            { opacity:0, y:20 })
        gsap.set('.h-ctas',            { opacity:0, y:18 })

        const tl = gsap.timeline({ delay: 0.3 })
        tl
          /* Glass builds */
          .to('.mg-glass',          { opacity:1, duration:0.01 })
          .to('.mg-base',           { opacity:1, scaleX:1, duration:0.22, ease:'power2.out' }, 0)
          .to('.mg-stem',           { opacity:1, scaleY:1, duration:0.3,  ease:'power3.out' }, 0.12)
          .to('.mg-rim',            { opacity:1, scaleX:1, duration:0.28, ease:'back.out(1.8)' }, 0.28)

          /* Shaker swoops in and tilts */
          .to('.mg-shaker', { opacity:1, y:0, duration:0.28, ease:'power2.out' }, 0.38)
          .to('.mg-shaker', { rotate:-44, x:-14, duration:0.3, ease:'power2.inOut' }, 0.6)

          /* Ice cubes fly in from corners */
          .to('.mg-ice-3',  { opacity:1, x:0, y:0, rotate:-18, duration:0.45, ease:'back.out(1.4)' }, 0.72)
          .to('.mg-ice-1',  { opacity:1, x:0, y:0, rotate:-8,  duration:0.45, ease:'back.out(1.4)' }, 0.78)
          .to('.mg-ice-2',  { opacity:1, x:0, y:0, rotate:12,  duration:0.45, ease:'back.out(1.4)' }, 0.82)

          /* Pour begins */
          .to('.mg-pour',           { opacity:1, scaleY:1, duration:0.22 }, 0.82)
          .to('.mg-liquid',         { opacity:1, scaleY:1, duration:0.4,  ease:'power2.out' }, 0.9)
          .to('.mg-liquid-surface', { opacity:1, duration:0.18 }, 1.18)

          /* Shaker + stream exit */
          .to(['.mg-shaker','.mg-pour'], { opacity:0, y:-20, duration:0.22, ease:'power2.in' }, 1.2)

          /* Garnish drops */
          .to('.mg-garnish', { opacity:1, y:0, x:0, rotate:0, scale:1, duration:0.5, ease:'elastic.out(1.1,0.55)' }, 1.28)

          /* Condensation */
          .to('.mg-drops',   { opacity:1, scale:1, duration:0.3, stagger:0.04, ease:'back.out(2)' }, 1.35)

          /* Atmosphere */
          .to('.mg-glow',    { opacity:1, scale:1, duration:0.45, ease:'power2.out' }, 1.5)
          .to('.mg-smoke-a', { opacity:0.85, y:0, duration:0.4 }, 1.55)
          .to('.mg-smoke-b', { opacity:0.65, y:0, duration:0.4 }, 1.62)

          /* Text reveals */
          .to('.h-line-1', { opacity:1, y:0, duration:0.38, ease:'power3.out' }, 1.65)
          .to('.h-line-2', { opacity:1, y:0, duration:0.38, ease:'power3.out' }, 1.78)
          .to('.h-line-3', { opacity:1, y:0, duration:0.35, ease:'power3.out' }, 1.9)
          .to('.h-desc',   { opacity:1, y:0, duration:0.32 }, 2.05)
          .to('.h-ctas',   { opacity:1, y:0, duration:0.32 }, 2.18)
      }, sectionRef)
    }
    init()
    return () => { ctx?.revert() }
  }, [])

  return (
    <section ref={sectionRef} className="relative h-screen bg-[#050505] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background:'radial-gradient(ellipse 50% 60% at 66% 54%, rgba(50,6,14,0.7), transparent)',
      }} />

      <div className="relative z-10 h-full max-w-7xl mx-auto px-8 lg:px-16 flex items-center gap-4">
        <div className="w-full lg:w-[46%] flex flex-col">
          <div className="h-line-1 mb-4">
            <span className="font-display text-[9px] tracking-[0.55em] text-[#e84800]/80 uppercase">
              Underground Bar &amp; Lounge
            </span>
          </div>
          <h1 className="font-display font-bold leading-none mb-2"
            style={{ fontSize:'clamp(3.8rem,7vw,7.5rem)' }}>
            <span className="h-line-2 block text-[#ede8e4]">ENTER</span>
            <span className="h-line-3 block text-[#e84800] glow-text">THE CAVE</span>
          </h1>
          <div className="w-10 h-px my-8 h-line-3" style={{ background:'rgba(232,72,0,0.35)' }} />
          <p className="h-desc font-sans font-light text-white/25 leading-loose max-w-[300px] mb-12"
            style={{ fontSize:'0.92rem', letterSpacing:'0.025em' }}>
            Where extraordinary cocktails meet a world built beneath the streets.
            Bold flavours. Pure atmosphere.
          </p>
          <div className="h-ctas flex flex-wrap gap-4">
            <a href="#reservation"
              className="font-display text-[10px] tracking-[0.25em] uppercase px-9 py-4 bg-[#e84800] text-white hover:bg-[#ff5500] transition-colors duration-300"
              style={{ boxShadow:'0 6px 28px rgba(232,72,0,0.3)', animation:'subtlePulse 3s ease-in-out infinite' }}>
              Reserve Now
            </a>
            <a href="#menu"
              className="font-display text-[10px] tracking-[0.25em] uppercase px-9 py-4 glass text-white/40 hover:text-white/70 transition-all duration-300">
              Explore Menu
            </a>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 items-center justify-center">
          <Cocktail />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none z-20">
        <span className="font-display text-[8px] tracking-[0.55em] text-white/12 uppercase">scroll</span>
        <div style={{
          width:1, height:44,
          background:'linear-gradient(180deg, rgba(232,72,0,0.5), transparent)',
          animation:'scrollLine 2s ease-in-out infinite',
        }} />
      </div>
    </section>
  )
}
