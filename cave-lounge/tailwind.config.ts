import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cave: {
          bg:      '#080808',
          warm:    '#0d0605',
          surface: '#141010',
          accent:  '#e84800',
          bright:  '#ff5500',
          text:    '#f5ede8',
          muted:   '#7a6055',
        }
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        sans:    ['Inter', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'marquee':    'marquee 45s linear infinite',
        'marquee2':   'marquee2 45s linear infinite',
        'flicker':    'flicker 4s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%,100%': { boxShadow: '0 0 20px rgba(232,72,0,0.3)' },
          '50%':     { boxShadow: '0 0 50px rgba(232,72,0,0.7)' },
        },
        'marquee':  { '0%': { transform: 'translateX(0%)' },    '100%': { transform: 'translateX(-50%)' } },
        'marquee2': { '0%': { transform: 'translateX(-50%)' },  '100%': { transform: 'translateX(0%)' } },
        'flicker': {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.85' },
          '75%':     { opacity: '0.95' },
        },
      },
    }
  },
  plugins: [],
}
export default config
