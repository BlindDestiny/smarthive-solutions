import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rc: {
          // Background system — branco / cinza muito claro
          bg:        '#fafaf9',
          surface:   '#ffffff',
          panel:     '#f4f3ef',
          panel2:    '#ebe9e2',

          // Text system — grafite escuro a cinza médio
          ink:       '#1a1d1f',
          body:      '#3d4146',
          muted:     '#8b8f95',
          mutedLight:'#b0b3b7',
          line:      '#e6e3dc',
          line2:     '#d8d4c8',

          // Wood accents — tons naturais subtis
          oak:       '#c4a886',
          walnut:    '#8b5a2a',
          walnutDark:'#6e3f15',
          amber:     '#c89866',

          // Premium warm accent
          gold:      '#a37e3e',
          goldLight: '#c5a262',

          // Deep neutrals
          graphite:  '#28292c',
          charcoal:  '#1a1c1e',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        widest2: '0.22em',
        widest3: '0.32em',
      },
      animation: {
        'fade-up':       'fade-up 1s cubic-bezier(0.22,1,0.36,1) both',
        'fade-up-slow':  'fade-up 1.4s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in':       'fade-in 1.2s ease-out both',
        'line-grow':     'line-grow 1.4s cubic-bezier(0.65,0,0.35,1) both',
        'slow-zoom':     'slow-zoom 18s ease-out both',
        'shimmer':       'shimmer 2.4s ease-in-out infinite',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'line-grow': {
          '0%':   { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        'slow-zoom': {
          '0%':   { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
        'shimmer': {
          '0%,100%': { opacity: '0.35' },
          '50%':     { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config
