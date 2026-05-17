import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bita: {
          bg:      '#faf3e3',
          surface: '#fdf9ed',
          panel:   '#f3e8cf',
          cream:   '#f7eed8',
          ink:     '#2d1f15',
          body:    '#5c4536',
          muted:   '#8d7665',
          line:    '#e6dabf',
          forest:  '#2b4434',
          forestLight: '#3a5a47',
          gold:    '#c5993b',
          goldDark: '#a17a26',
          goldLight: '#dcb866',
          peach:   '#e9b993',
          wine:    '#7a2e2e',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        script:  ['Caveat', 'cursive'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.22em',
      },
      animation: {
        'fade-up':   'fade-up 0.9s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in':   'fade-in 1.1s ease-out both',
        'sway':      'sway 6s ease-in-out infinite',
        'spin-slow': 'spin 24s linear infinite',
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
        'sway': {
          '0%,100%': { transform: 'rotate(-3deg)' },
          '50%':     { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
