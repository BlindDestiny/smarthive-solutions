import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'marquee':  'marquee 30s linear infinite',
        'marquee2': 'marquee2 30s linear infinite',
        'float':    'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        marquee:  { '0%': {transform:'translateX(0%)'},   '100%': {transform:'translateX(-50%)'} },
        marquee2: { '0%': {transform:'translateX(-50%)'}, '100%': {transform:'translateX(0%)'} },
        float:    { '0%,100%': {transform:'translateY(0px)'}, '50%': {transform:'translateY(-12px)'} },
      },
    },
  },
  plugins: [],
}
export default config
