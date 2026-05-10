export default function CaveLogo({ size = 40 }: { size?: number }) {
  const id = `cl${size}`
  return (
    <svg viewBox="0 0 100 92" width={size} height={Math.round(size * 0.92)}
      aria-label="Cave Lounge">
      <defs>
        <radialGradient id={`${id}fg`} cx="50%" cy="32%" r="58%">
          <stop offset="0%"   stopColor="#ffe050"/>
          <stop offset="30%"  stopColor="#ff7200"/>
          <stop offset="68%"  stopColor="#dd2800"/>
          <stop offset="100%" stopColor="#7a0e00"/>
        </radialGradient>
        <linearGradient id={`${id}wg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(210,80,0,0.95)"/>
          <stop offset="100%" stopColor="rgba(130,35,0,0.65)"/>
        </linearGradient>
        <filter id={`${id}gw`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id={`${id}sg`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── Cave interior fill ── */}
      <path d="M 50,5 L 87,83 L 13,83 Z"
        fill="rgba(12,3,2,0.85)"/>

      {/* ── Left rocky wall ── */}
      <path d="M 50,5 L 48,13 L 46,20 L 44,28 L 13,83"
        stroke={`url(#${id}wg)`} strokeWidth="3.8"
        fill="none" strokeLinecap="round" strokeLinejoin="round"/>

      {/* ── Right rocky wall ── */}
      <path d="M 50,5 L 52,13 L 54,20 L 56,28 L 87,83"
        stroke={`url(#${id}wg)`} strokeWidth="3.8"
        fill="none" strokeLinecap="round" strokeLinejoin="round"/>

      {/* ── Ground stones ── */}
      <path d="M 13,83 L 19,81 L 26,83 L 33,81 L 40,83 L 50,82 L 60,83 L 67,81 L 74,83 L 81,81 L 87,83"
        stroke="rgba(170,55,0,0.65)" strokeWidth="1.5" fill="none"/>

      {/* ── Ground glow ── */}
      <ellipse cx="50" cy="84" rx="26" ry="3.5"
        fill="rgba(232,80,0,0.2)" filter={`url(#${id}sg)`}/>

      {/* ── Flame glow halo ── */}
      <ellipse cx="50" cy="56" rx="18" ry="22"
        fill="rgba(232,80,0,0.12)" filter={`url(#${id}sg)`}/>

      {/* ── Flame body ── */}
      <path d="
        M 50,80
        C 48,74 42,66 44,56
        C 45,50 40,47 40,47
        C 46,53 45,47 46,40
        C 47,32 50,26 50,26
        C 50,26 53,32 54,40
        C 55,47 54,53 60,47
        C 60,47 55,50 56,56
        C 58,66 52,74 50,80 Z"
        fill={`url(#${id}fg)`}
        filter={`url(#${id}gw)`}/>

      {/* ── Left feather wing ── */}
      <path d="M 46,63 C 38,61 33,52 36,44 C 40,55 44,57 46,61"
        fill="rgba(225,65,0,0.6)" filter={`url(#${id}gw)`}/>

      {/* ── Right feather wing ── */}
      <path d="M 54,63 C 62,61 67,52 64,44 C 60,55 56,57 54,61"
        fill="rgba(225,65,0,0.6)" filter={`url(#${id}gw)`}/>

      {/* ── Flame inner highlight ── */}
      <path d="M 50,73 C 49,67 47,60 48,53 C 49,49 50,45 50,45 C 50,45 51,49 52,53 C 53,60 51,67 50,73"
        fill="rgba(255,225,100,0.45)"/>

      {/* ── Apex spark ── */}
      <circle cx="50" cy="27" r="1.5" fill="rgba(255,245,180,0.8)"
        filter={`url(#${id}gw)`}/>
    </svg>
  )
}
