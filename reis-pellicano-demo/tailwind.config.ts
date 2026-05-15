import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rp: {
          bg:        '#fafafa',
          surface:   '#ffffff',
          panel:     '#f4f4f3',
          ink:       '#0f1419',
          body:      '#3d4651',
          muted:     '#7a828c',
          line:      '#e6e4df',
          gold:      '#b29243',
          goldDark:  '#8c7032',
          goldLight: '#d4b56b',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.22em',
      },
      animation: {
        'fade-up':   'fade-up 0.9s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in':   'fade-in 1.1s ease-out both',
        'line-grow': 'line-grow 1.2s cubic-bezier(0.65,0,0.35,1) both',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
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
      },
    },
  },
  plugins: [],
}
export default config
